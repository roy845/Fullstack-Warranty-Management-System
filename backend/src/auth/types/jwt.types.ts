import { UserRoles } from '../roles/user-roles.enum';

export type JWTPayload = {
  _id: string;
  username: string;
  email: string;
  roles: UserRoles[];
};

export type UserJWTResponse = {
  _id: string;
  username: string;
  email: string;
  roles: UserRoles[];
};

export interface DecodedToken {
  id: number;
  exp: number;
  username: string;
  email: string;
  roles: UserRoles[];
}
