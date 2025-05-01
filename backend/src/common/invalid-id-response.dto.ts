import { ApiProperty } from '@nestjs/swagger';

export class InvalidIdResponseDto {
  @ApiProperty({
    example: 'Invalid ID format: sdfsdf',
    description: 'Detailed message explaining why the ID is invalid',
  })
  message: string;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error type',
  })
  error: string;

  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;
}
