import { ApiProperty } from '@nestjs/swagger';
import { FormTarget } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { FormFieldDto } from './form-schema.dto';

export class UpsertFormSchemaDto {
  @ApiProperty({ enum: FormTarget, example: FormTarget.PROFESSOR })
  @IsEnum(FormTarget)
  target!: FormTarget;

  @ApiProperty({ example: 'فرم اطلاعات استاد' })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({ type: [FormFieldDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  schema!: FormFieldDto[];
}
