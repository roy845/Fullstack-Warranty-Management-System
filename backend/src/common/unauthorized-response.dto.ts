import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponseDto {
  @ApiProperty({ example: 'Unauthorized', description: 'Error message' })
  message: string;

  @ApiProperty({ example: 401, description: 'HTTP status code' })
  statusCode: number;
}
