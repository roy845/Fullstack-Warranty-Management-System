import { ApiProperty } from '@nestjs/swagger';

export class NoInvoiceFileResponseDto {
  @ApiProperty({
    example: 'Invoice file is required',
    description: 'Error message',
  })
  message: string;

  @ApiProperty({ example: 'Bad Request', description: 'Error type' })
  error: string;

  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;
}
