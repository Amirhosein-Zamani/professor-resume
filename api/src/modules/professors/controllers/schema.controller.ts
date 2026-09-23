import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FormTarget, UserRole } from '@prisma/client';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { FormSchemaResponseDto } from '../dto/form-schema.dto';
import { UpsertFormSchemaDto } from '../dto/upsert-form-schema.dto';
import { FormSchemaService } from '../services/form-schema.service';

@ApiTags('Form Schemas')
@Controller('forms')
export class FormSchemaController {
  constructor(private readonly formSchemaService: FormSchemaService) {}

  @ApiOperation({
    summary: 'Get all dynamic form schemas',
    description:
      'Returns both dynamic form schemas (professor + activity) so the frontend can render the corresponding forms dynamically.',
  })
  @ApiOkResponse({
    type: [FormSchemaResponseDto],
  })
  @Get()
  getForms() {
    return this.formSchemaService.getAllForms();
  }

  @ApiOperation({
    summary: 'Get a single dynamic form schema by target',
    description: 'target must be either "PROFESSOR" or "ACTIVITY".',
  })
  @ApiOkResponse({
    type: FormSchemaResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Form schema not found for this target.',
  })
  @Get(':target')
  getFormByTarget(
    @Param('target', new ParseEnumPipe(FormTarget)) target: FormTarget,
  ) {
    return this.formSchemaService.getFormByTarget(target);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Create or replace a dynamic form schema',
    description:
      'Upserts the form schema for the given target (PROFESSOR or ACTIVITY).',
  })
  @ApiOkResponse({
    type: FormSchemaResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  upsertForm(@Body() dto: UpsertFormSchemaDto) {
    return this.formSchemaService.upsertForm(dto);
  }
}
