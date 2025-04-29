import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/auth/roles/user-roles.enum';
import { BioResponse } from './bio-response.dto';

export class UserResponse {
  @ApiProperty({ example: '65e732946f2f3b13a9a8035c', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'royatali', description: 'Username of the user' })
  username: string;

  @ApiProperty({
    example: 'royatali94@gmail.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: [UserRoles.USER],
    description: 'Roles assigned to the user',
    enum: UserRoles,
    isArray: true,
  })
  roles: UserRoles[];

  @ApiProperty({ type: () => BioResponse })
  bio: BioResponse;

  @ApiProperty({
    example: '2024-04-27T12:34:56.789Z',
    description: 'Timestamp of user creation',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-04-29T09:00:00.000Z',
    description: 'Timestamp of last user update',
  })
  updatedAt: Date;

  constructor(
    id: string,
    username: string,
    email: string,
    roles: UserRoles[],
    bio: BioResponse,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
    this.bio = bio;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
