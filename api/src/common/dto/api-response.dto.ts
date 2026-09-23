import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success!: true;
}

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: 'professor-resume-api' })
  service!: string;

  @ApiProperty({ example: '1.1.0' })
  version!: string;

  @ApiProperty({
    example: '2026-06-21T10:30:00.000Z',
    format: 'date-time',
  })
  timestamp!: string;
}
