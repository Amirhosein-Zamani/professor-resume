import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessResponseDto } from '../../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateProfessorActivityDto } from '../dto/create-professor-activity.dto';
import { CreateProfessorDto } from '../dto/create-professor.dto';
import { ListProfessorsQueryDto } from '../dto/list-professors-query.dto';
import { UpsertProfessorLinksDto } from '../dto/professor-links.dto';
import {
  ProfessorActivitiesResponseDto,
  ProfessorActivityResponseDto,
  ProfessorDetailResponseDto,
  ProfessorLinksResponseDto,
  ProfessorListItemResponseDto,
} from '../dto/professor-response.dto';
import { UpdateProfessorActivityDto } from '../dto/update-professor-activity.dto';
import { UpdateProfessorDto } from '../dto/update-professor.dto';
import { ProfessorsService } from '../services/professors.service';
import { ProfessorAccessGuard } from '../guards/professor-access.guard';

const CV_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

@ApiTags('Professors')
@Controller('professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @ApiOperation({
    summary: 'List professors',
    description:
      'Returns the public list payload used by the professors card/list UI.',
  })
  @ApiOkResponse({
    type: [ProfessorListItemResponseDto],
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter professors by display name, first name, or last name.',
  })
  @ApiQuery({
    name: 'faculty',
    required: false,
    description: 'Filter professors by faculty name.',
  })
  @ApiQuery({
    name: 'group',
    required: false,
    description: 'Filter professors by educational group / research group.',
  })
  @Get()
  getProfessors(@Query() query: ListProfessorsQueryDto) {
    return this.professorsService.listProfessors(query);
  }

  @ApiOperation({
    summary: 'Get professor detail',
    description: 'Fetches one professor by database id or slug.',
  })
  @ApiOkResponse({
    type: ProfessorDetailResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Professor not found.',
  })
  @Get(':idOrSlug')
  getProfessor(@Param('idOrSlug') idOrSlug: string) {
    return this.professorsService.getProfessorByIdOrSlug(idOrSlug);
  }

  @ApiOperation({
    summary: 'Get professor activities',
    description:
      'Returns public activity data for one professor by database id or slug.',
  })
  @ApiOkResponse({
    type: ProfessorActivitiesResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Professor not found.',
  })
  @Get(':idOrSlug/activities')
  getProfessorActivities(@Param('idOrSlug') idOrSlug: string) {
    return this.professorsService.getProfessorActivities(idOrSlug);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Create professor',
    description:
      'multipart/form-data: تمام فیلدهای CreateProfessorDto به‌صورت فیلدهای متنی فرم ارسال می‌شوند ' +
      '(links باید JSON.stringify شده به‌عنوان یک فیلد متنی ارسال شود)، و فایل CV (اختیاری) در فیلد "cv". ' +
      'در صورتی که ایمیل ارسال شود، به‌صورت خودکار یک یوزر با نقش EDITOR برای این استاد ساخته شده ' +
      'و یک کد OTP برای ورود اولیه به ایمیل او ارسال می‌شود.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cv: {
          type: 'string',
          format: 'binary',
          description: 'فایل PDF رزومه (اختیاری)',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: ProfessorDetailResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @ApiConflictResponse({
    description: 'A professor with a unique field already exists.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('cv', { limits: { fileSize: CV_MAX_FILE_SIZE_BYTES } }),
  )
  @Post()
  createProfessor(
    @Body() dto: CreateProfessorDto,
    @UploadedFile() cvFile?: Express.Multer.File,
  ) {
    return this.professorsService.createProfessor(dto, cvFile);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Update professor',
    description:
      'multipart/form-data: تمام فیلدهای UpdateProfessorDto به‌صورت فیلدهای متنی فرم ارسال می‌شوند ' +
      '(links باید JSON.stringify شده به‌عنوان یک فیلد متنی ارسال شود)، و فایل CV جدید (اختیاری) در فیلد "cv" ' +
      '— در صورت آپلود، فایل قبلی جایگزین می‌شود.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cv: {
          type: 'string',
          format: 'binary',
          description: 'فایل PDF رزومه (اختیاری)',
        },
      },
    },
  })
  @ApiOkResponse({
    type: ProfessorDetailResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @ApiNotFoundResponse({
    description: 'Professor not found.',
  })
  @ApiConflictResponse({
    description: 'A professor with a unique field already exists.',
  })
  @UseGuards(JwtAuthGuard, ProfessorAccessGuard)
  @UseInterceptors(
    FileInterceptor('cv', { limits: { fileSize: CV_MAX_FILE_SIZE_BYTES } }),
  )
  @Patch(':id')
  updateProfessor(
    @Param('id') id: string,
    @Body() dto: UpdateProfessorDto,
    @UploadedFile() cvFile?: Express.Multer.File,
  ) {
    return this.professorsService.updateProfessor(id, dto, cvFile);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Delete professor',
  })
  @ApiOkResponse({
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @ApiNotFoundResponse({
    description: 'Professor not found.',
  })
  @ApiForbiddenResponse({
    description: 'Only administrators can delete professors.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteProfessor(@Param('id') id: string) {
    return this.professorsService.deleteProfessor(id);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Create professor activity',
  })
  @ApiCreatedResponse({
    type: ProfessorActivityResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @ApiNotFoundResponse({
    description: 'Professor not found.',
  })
  @UseGuards(JwtAuthGuard, ProfessorAccessGuard)
  @Post(':id/activities')
  createActivity(
    @Param('id') id: string,
    @Body() dto: CreateProfessorActivityDto,
  ) {
    return this.professorsService.createActivity(id, dto);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Update professor activity',
  })
  @ApiOkResponse({
    type: ProfessorActivityResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @ApiNotFoundResponse({
    description: 'Professor or professor activity not found.',
  })
  @UseGuards(JwtAuthGuard, ProfessorAccessGuard)
  @Patch(':id/activities/:activityId')
  updateActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
    @Body() dto: UpdateProfessorActivityDto,
  ) {
    return this.professorsService.updateActivity(id, activityId, dto);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Delete professor activity',
  })
  @ApiOkResponse({
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @ApiNotFoundResponse({
    description: 'Professor or professor activity not found.',
  })
  @UseGuards(JwtAuthGuard, ProfessorAccessGuard)
  @Delete(':id/activities/:activityId')
  deleteActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
  ) {
    return this.professorsService.deleteActivity(id, activityId);
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Upsert professor links',
  })
  @ApiOkResponse({
    type: ProfessorLinksResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @ApiNotFoundResponse({
    description: 'Professor not found.',
  })
  @UseGuards(JwtAuthGuard, ProfessorAccessGuard)
  @Put(':id/links')
  upsertLinks(@Param('id') id: string, @Body() dto: UpsertProfessorLinksDto) {
    return this.professorsService.upsertLinks(id, dto);
  }
}
