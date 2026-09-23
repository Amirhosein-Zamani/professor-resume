import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class ManagedUserProfessorDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  displayName!: string;
}

export class UserManagementResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'editor@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiPropertyOptional({ nullable: true })
  professorId!: string | null;

  @ApiPropertyOptional({ type: ManagedUserProfessorDto, nullable: true })
  professor!: ManagedUserProfessorDto | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: Date;
}
