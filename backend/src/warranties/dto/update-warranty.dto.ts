import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWarrantyDto } from './create-warranty.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { WarrantyStatus } from '../types/warranty.types';

export class UpdateWarrantyDto extends PartialType(CreateWarrantyDto) {
  @ApiProperty({
    description: 'Warranty status',
    enum: WarrantyStatus,
    required: false,
  })
  @IsEnum(WarrantyStatus)
  @IsOptional()
  status?: WarrantyStatus;
}
