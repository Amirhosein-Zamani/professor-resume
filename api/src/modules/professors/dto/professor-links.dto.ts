import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  plainToInstance,
  Transform,
  type TransformFnParams,
  Type,
} from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { IsBase64Image } from 'src/config/IsBase64Image';

export class UpsertProfessorLinksDto {
  @ApiPropertyOptional({
    example: 'https://scholar.google.com/citations?user=example',
  })
  @IsOptional()
  @IsUrl()
  scholar?: string;

  @ApiPropertyOptional({
    example: 'https://www.researchgate.net/profile/Reza-Mortazavi',
  })
  @IsOptional()
  @IsUrl()
  researchgate?: string;

  @ApiPropertyOptional({
    example: 'https://www.scopus.com/authid/detail.uri?authorId=12345678900',
  })
  @IsOptional()
  @IsUrl()
  scopus?: string;

  @ApiPropertyOptional({
    example: 'https://example.edu/faculty/reza-mortazavi',
  })
  @IsOptional()
  @IsUrl()
  website?: string;
}

export class BaseProfessorDto {
  @ApiProperty({
    example: 'reza-mortazavi',
  })
  @IsString()
  @MinLength(1)
  slug!: string;

  @ApiProperty({
    example: 'رضا',
  })
  @IsString()
  @MinLength(1)
  firstName!: string;

  @ApiProperty({
    example: 'مرتضوی',
  })
  @IsString()
  @MinLength(1)
  lastName!: string;

  @ApiProperty({
    example: 'دکتر رضا مرتضوی',
  })
  @IsString()
  @MinLength(1)
  displayName!: string;

  @ApiPropertyOptional({
    example: '0012345678',
  })
  @IsOptional()
  @IsString()
  nationalCode?: string;

  @ApiProperty({
    example: 'استادیار',
  })
  @IsString()
  @MinLength(1)
  rank!: string;

  @ApiProperty({
    example: 'e7b27ec5-dff3-4b8c-b7a7-4f6e4f3c0e9f',
    description: 'شناسه دانشکده انتخاب‌شده از GET /api/faculties',
  })
  @IsUUID()
  facultyId!: string;

  @ApiPropertyOptional({
    example: 'هوش مصنوعی و سیستم های نرم افزاری',
  })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiProperty({
    example: true,
    description:
      'در multipart/form-data به‌صورت رشته "true"/"false" ارسال می‌شود؛ اینجا خودکار به boolean تبدیل می‌شود.',
  })
  @Transform((params: TransformFnParams): unknown => {
    const value = params.value as unknown;
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isFaculty!: boolean;

  @ApiProperty({
    description:
      'تصویر پروفایل به‌صورت رشته base64 خالص (بدون پیشوند data:image/...;base64,).',
    example: '/9j/4AAQSkZJRgABAQAAAQABAAD...',
  })
  @IsString()
  @MinLength(1)
  @IsBase64Image()
  avatar!: string;

  @ApiPropertyOptional({
    example: 'reza.mortazavi@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'عضو هیئت علمی دانشکده مهندسی کامپیوتر با تمرکز بر هوش مصنوعی.',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: '1304',
  })
  @IsOptional()
  @IsString()
  golestanProfessorNo?: string;

  @ApiPropertyOptional({
    example: 'EMP-1024',
  })
  @IsOptional()
  @IsString()
  employeeNo?: string;

  @ApiPropertyOptional({
    example: 'STU-2048',
  })
  @IsOptional()
  @IsString()
  studentNo?: string;

  @ApiPropertyOptional({
    example: 'دانشکده مهندسی',
  })
  @IsOptional()
  @IsString()
  facultyName?: string;

  @ApiPropertyOptional({
    example: 'گروه هوش مصنوعی',
  })
  @IsOptional()
  @IsString()
  researchGroupName?: string;

  @ApiPropertyOptional({
    example: 'دانشگاه دامغان',
  })
  @IsOptional()
  @IsString()
  organizationName?: string;

  @ApiPropertyOptional({
    type: UpsertProfessorLinksDto,
    description:
      'در multipart/form-data باید به‌صورت رشته JSON.stringify شده ارسال شود',
  })
  @IsOptional()
  @Transform((params: TransformFnParams): unknown => {
    const value = params.value as unknown;
    if (!value) return undefined;

    if (typeof value === 'object' && !Array.isArray(value)) {
      return plainToInstance(UpsertProfessorLinksDto, value);
    }

    // اگر string باشه، سعی کن parse کنه
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as unknown;
        // اگر پارس شده آبجکت باشه و خالی نباشه
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return plainToInstance(UpsertProfessorLinksDto, parsed);
        }
        return undefined;
      } catch {
        return undefined;
      }
    }

    return undefined;
  })
  @ValidateNested()
  @Type(() => UpsertProfessorLinksDto)
  links?: UpsertProfessorLinksDto;
}
