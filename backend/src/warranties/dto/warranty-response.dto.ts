import { ApiProperty } from '@nestjs/swagger';
import { WarrantyStatus } from '../types/warranty.types';
import { WarrantyUserDto } from './warranty-user.dto';

export class WarrantyResponseDto {
  @ApiProperty({
    example: '65e74d2c9b1f58ae88fd3e00',
    description: 'Warranty ID',
  })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Client name' })
  clientName: string;

  @ApiProperty({
    example: 'Tadiran AC 12BTU',
    description: 'Product information',
  })
  productInfo: string;

  @ApiProperty({
    example: '2024-01-01',
    type: String,
    format: 'date',
    description: 'Installation date',
  })
  installationDate: Date;

  @ApiProperty({
    example: 'invoice_123.pdf',
    description: 'Uploaded invoice file name',
  })
  invoiceFilename: string;

  @ApiProperty({
    enum: WarrantyStatus,
    example: WarrantyStatus.approved,
    description: 'Warranty status (approved, rejected, pending, manual_review)',
  })
  status: WarrantyStatus;

  @ApiProperty({
    description: 'User (installer) details',
    type: WarrantyUserDto,
  })
  user: WarrantyUserDto;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Created timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T14:30:00Z',
    description: 'Last updated timestamp',
  })
  updatedAt: Date;
}
