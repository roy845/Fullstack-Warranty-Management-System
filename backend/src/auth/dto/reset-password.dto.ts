import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'resetTokenExample',
    description: 'Reset password token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'NewStrongPass1!', description: 'New user password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password too weak.',
  })
  newPassword: string;
}
