import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

const trimOptionalString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export class ListProfessorsQueryDto {
  @ApiPropertyOptional({
    example: 'رضا',
    description:
      'Filters professors by display name, first name, or last name.',
  })
  @IsOptional()
  @Transform(trimOptionalString)
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'دانشکده فنی و مهندسی',
    description: 'Filters professors by faculty name.',
  })
  @IsOptional()
  @Transform(trimOptionalString)
  @IsString()
  faculty?: string;

  @ApiPropertyOptional({
    example: 'مهندسی کامپیوتر',
    description: 'Filters professors by educational group / research group.',
  })
  @IsOptional()
  @Transform(trimOptionalString)
  @IsString()
  group?: string;
}
