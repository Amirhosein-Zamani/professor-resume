import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({
    example: 'admin@example.com',
  })
  @IsEmail()
  email!: string;
}
