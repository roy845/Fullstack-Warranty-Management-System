import { ApiProperty } from '@nestjs/swagger';
import { WarrantyResponseDto } from './warranty-response.dto';

export class PaginatedWarrantiesResponseDto {
  @ApiProperty({
    description: 'Array of warranty records',
    type: [WarrantyResponseDto],
  })
  data: WarrantyResponseDto[];

  @ApiProperty({
    description: 'Total number of matching warranties (for pagination)',
    example: 57,
  })
  total: number;
}
