import {
  IsString,
  IsDateString,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class InvoiceFileDto {
  @ApiProperty({
    description: 'URI of the invoice file',
    example: 'file:///storage/emulated/0/Download/invoice.pdf',
  })
  @IsString()
  @IsNotEmpty({ message: 'Invoice file URI is required' })
  uri: string;

  @ApiProperty({
    description: 'Name of the invoice file',
    example: 'invoice.pdf',
  })
  @IsString()
  @IsNotEmpty({ message: 'Invoice file name is required' })
  name: string;

  @ApiProperty({
    description: 'MIME type of the invoice file',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty({ message: 'Invoice file type is required' })
  type: string;
}

export class CreateWarrantyDto {
  @ApiProperty({
    description: 'Name of the client',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Client name is required' })
  clientName: string;

  @ApiProperty({
    description: 'Product information',
    example: 'Air Conditioner Model X123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Product info is required' })
  productInfo: string;

  @ApiProperty({
    description: 'Installation date (ISO format)',
    example: '2025-04-29',
    type: String,
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'Installation date must be a valid ISO date string' },
  )
  @IsNotEmpty({ message: 'Installation date is required' })
  installationDate: Date;

  @ApiProperty({
    description: 'Invoice file metadata',
    type: () => InvoiceFileDto,
  })
  @ValidateNested()
  @Type(() => InvoiceFileDto)
  invoiceFile: InvoiceFileDto;
}
