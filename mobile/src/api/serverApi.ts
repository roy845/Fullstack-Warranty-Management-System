import {
  Auth,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  LoginDto,
  RefreshTokenDto,
  RefreshTokenResponse,
  ResetPasswordDto,
  SignupDto,
} from "../types/auth.types";
import { axiosPublic } from "./api";
import { API_URLS } from "./api-urls";

export const signup = (signupDto: SignupDto): Promise<{ data: string }> => {
  try {
    const { signup } = API_URLS;

    return axiosPublic.post(signup, signupDto);
  } catch (error) {
    throw error;
  }
};

export const login = (loginDto: LoginDto): Promise<{ data: Auth }> => {
  try {
    const { login } = API_URLS;

    return axiosPublic.post(login, loginDto, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error;
  }
};

export const refreshToken = (
  refreshTokenDto: RefreshTokenDto
): Promise<{ data: RefreshTokenResponse }> => {
  try {
    const { refreshToken } = API_URLS;

    return axiosPublic.post(refreshToken, refreshTokenDto);
  } catch (error) {
    throw error;
  }
};

export const logout = (refreshTokenDto: RefreshTokenDto): Promise<boolean> => {
  try {
    const { logout } = API_URLS;

    return axiosPublic.post(logout, refreshTokenDto);
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = (
  forgotPasswordDto: ForgotPasswordDto
): Promise<{ data: ForgotPasswordResponse }> => {
  try {
    const { forgotPassword } = API_URLS;

    return axiosPublic.post(forgotPassword, forgotPasswordDto);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = (
  resetPasswordDto: ResetPasswordDto
): Promise<{ data: string }> => {
  try {
    const { resetPassword } = API_URLS;

    return axiosPublic.post(resetPassword, resetPasswordDto);
  } catch (error) {
    throw error;
  }
};
