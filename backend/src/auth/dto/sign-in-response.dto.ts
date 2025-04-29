import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access Token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'dGhpc2lzbXlyZWZyZXNodG9rZW4=',
    description: 'Refresh Token',
  })
  refreshToken: string;

  @ApiProperty({ example: 'Login successful', description: 'Status message' })
  message: string;
}
