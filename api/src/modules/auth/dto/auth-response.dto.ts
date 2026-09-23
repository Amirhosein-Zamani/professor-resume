import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({
    example: 'clx1234567890abcdef123456',
  })
  id!: string;

  @ApiProperty({
    example: 'admin@example.com',
  })
  email!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role!: UserRole;

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

export class AuthUserEnvelopeDto {
  @ApiProperty({
    type: AuthUserResponseDto,
  })
  user!: AuthUserResponseDto;
}
