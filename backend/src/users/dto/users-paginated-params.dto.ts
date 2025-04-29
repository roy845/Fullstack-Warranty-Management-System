import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';
import { BasePaginatedParamsDto } from 'src/common/base-paginated-params.dto';

export class UsersPaginatedParamsDto extends BasePaginatedParamsDto {
  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Field to sort by',
    enum: ['createdAt', 'updatedAt', 'username', 'email'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'username', 'email'])
  sortBy?: 'createdAt' | 'updatedAt' | 'username' | 'email' = 'createdAt';
}
