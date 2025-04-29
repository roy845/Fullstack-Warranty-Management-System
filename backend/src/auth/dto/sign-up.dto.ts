import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'JohnDoe', description: 'Username of the new user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongPassw0rd!',
    description: 'Password (8-32 chars, upper, lower, digit, special char)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password too weak.',
  })
  password: string;
}
