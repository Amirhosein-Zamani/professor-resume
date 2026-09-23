import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormTarget } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export const FORM_FIELD_TYPES = [
  'text',
  'textarea',
  'email',
  'number',
  'date',
  'select',
  'checkbox',
  'file',
  'url',
] as const;

export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];

export class FormFieldOptionDto {
  @ApiProperty({ example: 'استادیار' })
  @IsString()
  @MinLength(1)
  label!: string;

  @ApiProperty({ example: 'استادیار' })
  @IsString()
  @MinLength(1)
  value!: string;
}

export class FormFieldDto {
  @ApiProperty({
    example: 'firstName',
    description: 'کلید فیلد که به نام فیلد در DTO مقصد مپ می‌شود.',
  })
  @IsString()
  @MinLength(1)
  key!: string;

  @ApiProperty({ example: 'نام' })
  @IsString()
  @MinLength(1)
  label!: string;

  @ApiProperty({
    example: 'text',
    enum: FORM_FIELD_TYPES,
  })
  @IsIn(FORM_FIELD_TYPES)
  type!: FormFieldType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({
    type: [FormFieldOptionDto],
    description: 'فقط برای type=select استفاده می‌شود.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldOptionDto)
  options?: FormFieldOptionDto[];

  @ApiPropertyOptional({
    example: 'image/*',
    description: 'فقط برای type=file استفاده می‌شود.',
  })
  @IsOptional()
  @IsString()
  accept?: string;

  @ApiPropertyOptional({ example: 'مثال: رضا' })
  @IsOptional()
  @IsString()
  placeholder?: string;
}

export class FormSchemaResponseDto {
  @ApiProperty({ example: 'clxformschema1234567890abc' })
  id!: string;

  @ApiProperty({ enum: FormTarget, example: FormTarget.PROFESSOR })
  target!: FormTarget;

  @ApiProperty({ example: 'فرم اطلاعات استاد' })
  title!: string;

  @ApiProperty({ type: [FormFieldDto] })
  schema!: FormFieldDto[];

  @ApiProperty({
    example: '2026-06-21T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-06-21T10:30:00.000Z',
    format: 'date-time',
  })
  updatedAt!: string;
}
