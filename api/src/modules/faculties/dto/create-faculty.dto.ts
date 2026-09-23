import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreateFacultyDto {
  @ApiProperty({
    example: 'دانشکده مهندسی',
  })
  @Transform((params: TransformFnParams): unknown => {
    const value = params.value as unknown;
    return typeof value === 'string' ? value.trim() : value;
  })
  @IsString()
  @MinLength(1)
  name!: string;
}
