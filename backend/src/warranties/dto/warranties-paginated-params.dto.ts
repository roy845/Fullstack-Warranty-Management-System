import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';
import { BasePaginatedParamsDto } from 'src/common/base-paginated-params.dto';

export class WarrantiesPaginatedParamsDto extends BasePaginatedParamsDto {
  @ApiPropertyOptional({
    example: 'clientName',
    description: 'Field to sort by',
    enum: ['clientName', 'productInfo', 'status', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsIn(['clientName', 'productInfo', 'status', 'createdAt', 'updatedAt'])
  sortBy?: 'clientName' | 'productInfo' | 'status' | 'createdAt' | 'updatedAt' =
    'clientName';
}
