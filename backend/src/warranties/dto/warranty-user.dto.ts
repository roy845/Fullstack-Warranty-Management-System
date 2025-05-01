import { ApiProperty } from '@nestjs/swagger';

export class WarrantyUserDto {
  @ApiProperty({ example: '6810a3168b6a511a7fb3bb8a', description: 'User ID' })
  _id: string;

  @ApiProperty({ example: 'JohnDoe', description: 'Username of the installer' })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the installer',
  })
  email: string;
}
