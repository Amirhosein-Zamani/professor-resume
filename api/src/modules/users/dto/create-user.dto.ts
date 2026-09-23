import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'editor@example.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.EDITOR })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.EDITOR;

  @ApiPropertyOptional({
    description: 'Optional professor profile assigned to this account.',
  })
  @IsOptional()
  @IsUUID()
  professorId?: string;
}
