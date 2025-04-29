// src/common/dto/base-paginated-params.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BasePaginatedParamsDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number (default 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of results per page (default 10)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort order: "asc" for ascending or "desc" for descending',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    example: '',
    description: 'Search keyword (case-insensitive)',
  })
  @IsOptional()
  @IsString()
  search?: string = '';
}
