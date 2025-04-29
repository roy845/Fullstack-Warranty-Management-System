import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'dGhpc2lzbXlyZWZyZXNodG9rZW4=',
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
