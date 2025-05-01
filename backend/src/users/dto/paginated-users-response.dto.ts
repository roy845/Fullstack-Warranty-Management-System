import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user-response.dto';

export class PaginatedUsersResponseDto {
  @ApiProperty({
    description: 'List of users for the current page',
    type: [UserResponse],
  })
  data: UserResponse[];

  @ApiProperty({
    description: 'Total number of users (for pagination)',
    example: 42,
  })
  total: number;
}
