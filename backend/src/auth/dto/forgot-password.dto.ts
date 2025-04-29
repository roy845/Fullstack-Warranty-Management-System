import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email to reset password',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
