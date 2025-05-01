import { ApiProperty } from '@nestjs/swagger';

export class UserNotFoundResponseDto {
  @ApiProperty({
    example: 404,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'User with ID 6811ad2c2ea6b5e253f46b7a not found',
    description: 'Detailed message about the missing resource',
  })
  message: string;

  @ApiProperty({
    example: '/api/users/6811ad2c2ea6b5e253f46b7a',
    description: 'The request path that triggered the error',
  })
  path: string;
}
