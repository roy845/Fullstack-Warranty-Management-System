import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

export class BioDto {
  @ApiPropertyOptional({
    example: 'Hello! Welcome to my profile!',
    description: 'Optional welcome message shown in the user profile',
  })
  welcomeMessage?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Optional avatar image URL',
  })
  avatar?: string;
}

export class UpdateUserDto extends PartialType(SignUpDto) {
  @ApiPropertyOptional({
    description: 'Optional biography fields',
    type: BioDto,
  })
  bio?: BioDto;
}
