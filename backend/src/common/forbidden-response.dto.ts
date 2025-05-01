import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponseDto {
  @ApiProperty({
    example: 'Forbidden resource',
    description: 'Error message describing why access is forbidden',
  })
  message: string;

  @ApiProperty({
    example: 'Forbidden',
    description: 'Error type',
  })
  error: string;

  @ApiProperty({
    example: 403,
    description: 'HTTP status code',
  })
  statusCode: number;
}
