import { AllowedRoles } from "./roles.types";

export type SignupDto = {
  username: string;
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RefreshTokenResponse = {
  message: string;
  accessToken: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  newPassword: string;
  token: string;
};

export type Auth = {
  message?: string;
  accessToken: string;
  refreshToken?: string;
};

export interface DecodedToken {
  _id: string;
  username: string;
  email: string;
  roles: AllowedRoles[];
}

export type RefreshTokenDto = {
  refreshToken: string;
};

export interface ForgotPasswordResponse {
  message: string;
  token: string;
}
