import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProfessorActivityDto {
  @ApiPropertyOptional({
    example: 'golestan-activity-42',
  })
  @IsOptional()
  @IsString()
  sourceId?: string;

  @ApiProperty({
    example: 'مقاله علمی',
  })
  @IsString()
  @MinLength(1)
  type!: string;

  @ApiPropertyOptional({
    example: 'طراحی سامانه های هوشمند در آموزش',
  })
  @IsOptional()
  @IsString()
  titleFa?: string;

  @ApiPropertyOptional({
    example: 'Intelligent Systems Design in Education',
  })
  @IsOptional()
  @IsString()
  titleEn?: string;

  @ApiPropertyOptional({
    example: 'A peer-reviewed journal article.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '2024-09-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
