import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: 'StrongPassw0rd!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password too weak.',
  })
  password: string;
}
