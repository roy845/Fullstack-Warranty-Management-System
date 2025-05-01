import { ApiProperty } from '@nestjs/swagger';

export class WarrantyNotFoundResponseDto {
  @ApiProperty({
    example: 404,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Warranty with ID 681321830e17dc2ae572a4eb not found',
    description: 'Error message describing the missing resource',
  })
  message: string;

  @ApiProperty({
    example: '/api/warranties/681321830e17dc2ae572a4eb',
    description: 'The path of the request that caused the error',
  })
  path: string;
}
