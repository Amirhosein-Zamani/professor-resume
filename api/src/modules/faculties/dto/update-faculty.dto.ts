import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFacultyDto {
  @ApiProperty({
    example: 'دانشکده مهندسی کامپیوتر',
  })
  @Transform((params: TransformFnParams): unknown => {
    const value = params.value as unknown;
    return typeof value === 'string' ? value.trim() : value;
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
