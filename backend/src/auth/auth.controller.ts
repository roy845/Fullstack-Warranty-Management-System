import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordResponse } from './dto/forgot-password-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or user already exists',
  })
  signUp(@Body() signUpDto: SignUpDto): Promise<string> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    description: 'Access token refreshed successfully',
    schema: {
      example: {
        accessToken: 'jwt-token',
        message: 'access token refreshed successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or expired refresh token' })
  @ApiForbiddenResponse({ description: 'Invalid refresh token' })
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() response: Response,
  ) {
    return this.authService.refreshToken(refreshTokenDto, response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and invalidate refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    description:
      'Logout successful (returns true) or Logout failed (returns false)',
    type: Boolean,
  })
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({
    description: 'Reset token generated and sent',
    type: ForgotPasswordResponse,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password with reset token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({
    description: 'Password reset successful',
    type: String,
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired reset token',
  })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<string> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('signin-admin')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    description:
      'Admin login successful. JWT access and refresh tokens returned. Refresh token set as httpOnly cookie.',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid admin credentials' })
  @HttpCode(HttpStatus.OK)
  async signInAdmin(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.signInAdmin(signInDto, res);
    res.json(result);
  }

  @Get('refresh-token-admin')
  @ApiOperation({ summary: 'Refresh admin access token' })
  @ApiOkResponse({
    description: 'Admin access token refreshed successfully.',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'No refresh token provided' })
  @ApiForbiddenResponse({ description: 'Invalid or mismatched token' })
  @HttpCode(HttpStatus.OK)
  async refreshTokenAdmin(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.refreshTokenAdmin(req, res);
    res.json(result);
    return result;
  }

  @Get('logout-admin')
  @ApiOperation({ summary: 'Logout admin and clear refresh token cookie' })
  @ApiOkResponse({
    description: 'Admin logged out successfully. Cookie cleared.',
    type: Boolean,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid session or no refresh token in cookie',
  })
  @HttpCode(HttpStatus.OK)
  async logoutAdmin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logoutAdmin(req, res);
  }
}
