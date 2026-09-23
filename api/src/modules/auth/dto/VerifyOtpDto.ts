import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'admin@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;
}
