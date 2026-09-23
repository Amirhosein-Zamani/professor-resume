import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiConflictResponse,
  ApiConsumes,
  ApiCookieAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { FacultiesService } from './faculties.service';
import { FacultyResponseDto } from './dto/faculty-response.dto';

const FACULTY_ICON_MAX_SIZE_BYTES = 256 * 1024;
const facultyMultipartBody = {
  schema: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        example: 'دانشکده مهندسی',
      },
      icon: {
        type: 'string',
        format: 'binary',
        description: 'Optional SVG icon, up to 256 KB.',
      },
    },
  },
};

@ApiTags('Faculties')
@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @ApiOperation({
    summary: 'List faculties',
    description: 'Returns the list of faculties ordered by name.',
  })
  @ApiOkResponse({
    type: [FacultyResponseDto],
  })
  @Get()
  listFaculties() {
    return this.facultiesService.listFaculties();
  }

  @ApiOperation({
    summary: 'Create faculty',
    description: 'Adds a new faculty to the list.',
  })
  @ApiCreatedResponse({
    type: FacultyResponseDto,
  })
  @ApiConflictResponse({
    description: 'Faculty name already exists.',
  })
  @ApiCookieAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(facultyMultipartBody)
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('icon', {
      limits: { fileSize: FACULTY_ICON_MAX_SIZE_BYTES },
    }),
  )
  @Post()
  createFaculty(
    @Body() dto: CreateFacultyDto,
    @UploadedFile() iconFile?: Express.Multer.File,
  ) {
    return this.facultiesService.createFaculty(dto, iconFile);
  }

  @ApiOperation({
    summary: 'Update faculty',
    description: 'Updates the name of an existing faculty.',
  })
  @ApiOkResponse({
    type: FacultyResponseDto,
  })
  @ApiConflictResponse({
    description: 'Faculty name already exists.',
  })
  @ApiNotFoundResponse({
    description: 'Faculty not found.',
  })
  @ApiCookieAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(facultyMultipartBody)
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('icon', {
      limits: { fileSize: FACULTY_ICON_MAX_SIZE_BYTES },
    }),
  )
  @Patch(':id')
  updateFaculty(
    @Param('id') id: string,
    @Body() dto: UpdateFacultyDto,
    @UploadedFile() iconFile?: Express.Multer.File,
  ) {
    return this.facultiesService.updateFaculty(id, dto, iconFile);
  }

  @ApiOperation({
    summary: 'Delete faculty',
    description: 'Deletes an existing faculty.',
  })
  @ApiOkResponse({
    type: FacultyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Faculty not found.',
  })
  @ApiConflictResponse({
    description: 'Faculty has professors and cannot be deleted.',
  })
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteFaculty(@Param('id') id: string) {
    return this.facultiesService.deleteFaculty(id);
  }
}
