import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarrantyDto {
  @ApiProperty({
    description: 'Name of the client',
    example: 'John Doe',
  })
  @IsString()
  clientName: string;

  @ApiProperty({
    description: 'Product information',
    example: 'Air Conditioner Model X123',
  })
  @IsString()
  productInfo: string;

  @ApiProperty({
    description: 'Installation date (ISO format)',
    example: '2025-04-29',
    type: String,
    format: 'date',
  })
  @IsDateString()
  installationDate: Date;
}
