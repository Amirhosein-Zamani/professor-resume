import { ApiProperty } from '@nestjs/swagger';

export class FacultyResponseDto {
  @ApiProperty({
    example: 'e7b27ec5-dff3-4b8c-b7a7-4f6e4f3c0e9f',
  })
  id!: string;

  @ApiProperty({
    example: 'دانشکده مهندسی',
  })
  name!: string;

  @ApiProperty({
    example: '/assets/faculties/7a7d7be3-2fe6-4fd9-b756-9c24de98fd70.svg',
    nullable: true,
  })
  iconUrl!: string | null;

  @ApiProperty({
    example: 32,
    description: 'Number of professors assigned to this faculty.',
  })
  professorCount!: number;

  @ApiProperty({
    example: '2026-07-31T12:30:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-31T12:30:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
