import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { JWTPayload } from './types/jwt.types';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordResponse } from './dto/forgot-password-response.dto';
import { AuthUtils } from './utils/auth-utils';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly EXPIRES_AT: number = 15 * 60 * 1000;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject('JWT_SERVICE') private readonly jwtService: JwtService,
    @Inject('JWT_REFRESH_SERVICE')
    private readonly jwtRefreshService: JwtService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  async signUp(signUpDto: SignUpDto): Promise<string> {
    const { username, email, password } = signUpDto;

    const newUser = new this.userModel({
      username,
      email,
      password,
    });
    const savedUser = await newUser.save();

    return `User ${savedUser.username} registered successfully!`;
  }

  generateTokens(payload: JWTPayload): [string, string] {
    const accessToken: string = this.jwtService.sign(payload);

    const refreshToken: string = this.jwtRefreshService.sign(payload);

    return [accessToken, refreshToken];
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signInDto;

    const user: UserDocument | null = await this.userModel.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const payload: JWTPayload = {
        _id: user._id as string,
        username: user.username,
        email: user.email,
        roles: user.roles,
      };

      const [accessToken, refreshToken] = this.generateTokens(payload);

      user.refreshToken = refreshToken;
      await user.save();

      return {
        accessToken,
        refreshToken,
        message: `User ${user.username} logged in successfully`,
      };
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, res: Response) {
    if (!refreshTokenDto.refreshToken)
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    const refreshToken: string = refreshTokenDto.refreshToken;

    const foundUser = await this.userModel.findOne({ refreshToken });

    if (!foundUser) return res.sendStatus(HttpStatus.FORBIDDEN);

    const payload: JWTPayload = {
      _id: foundUser._id as string,
      username: foundUser?.username,
      email: foundUser?.email,
      roles: foundUser?.roles,
    };

    try {
      const decoded: JWTPayload = this.jwtRefreshService.verify(refreshToken);
      if (foundUser.username !== decoded.username) {
        res.sendStatus(HttpStatus.FORBIDDEN);
      }

      const accessToken: string = this.jwtService.sign(payload);

      res.json({ accessToken, message: `access token refreshed successfully` });
      return {
        accessToken,
        message: `access token refreshed successfully`,
      };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      return res.sendStatus(HttpStatus.FORBIDDEN);
    }
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<boolean> {
    if (!refreshTokenDto.refreshToken) {
      return false;
    }

    const refreshToken: string = refreshTokenDto.refreshToken;
    const foundUser = await this.userModel.findOne({
      refreshToken: refreshToken,
    });

    if (!foundUser) {
      return false;
    }

    try {
      foundUser.refreshToken = undefined;
      await foundUser.save();

      return true;
    } catch (error) {
      console.error('Error while logging out:', error);
      return false;
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    const { email } = forgotPasswordDto;
    const user: UserDocument | null = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      const token: string = AuthUtils.generateResetPasswordToken();
      const expiresAt: Date = new Date(Date.now() + this.EXPIRES_AT);

      if (!user.resetPassword) {
        user.resetPassword = { token: '', expiresAt: new Date() };
      }

      user.resetPassword.token = token;
      user.resetPassword.expiresAt = expiresAt;

      await user.save();

      this.schedulePasswordResetDeletion(user);

      return { message: 'Reset your password', token };
    }
  }

  private schedulePasswordResetDeletion(user: UserDocument) {
    const jobName = `delete-reset-token-${user._id}`;

    if (this.schedulerRegistry.doesExist('cron', jobName)) {
      this.schedulerRegistry.deleteCronJob(jobName);
    }

    const job = new CronJob(
      new Date(Date.now() + this.EXPIRES_AT),
      async () => {
        user.resetPassword = undefined;
        await user.save();
        console.log('Expired reset token deleted.');
      },
    );

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { token, newPassword } = resetPasswordDto;

    const user: UserDocument | null = await this.userModel.findOne({
      'resetPassword.token': token,
    });

    if (!user || !user.resetPassword) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    if (user.resetPassword.expiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired.');
    }

    user.password = newPassword;
    user.resetPassword = undefined;

    await user.save();

    const jobName = `delete-reset-token-${user._id}`;
    if (this.schedulerRegistry.doesExist('cron', jobName)) {
      this.schedulerRegistry.deleteCronJob(jobName);
    }

    return 'Password reset successfully';
  }

  async signInAdmin(
    signInDto: SignInDto,
    res: Response,
  ): Promise<SignInResponseDto> {
    const { email, password } = signInDto;

    const user: UserDocument | null = await this.userModel.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const payload: JWTPayload = {
        _id: user._id as string,
        username: user.username,
        email: user.email,
        roles: user.roles,
      };

      const [accessToken, refreshToken] = this.generateTokens(payload);

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return {
        accessToken,
        refreshToken,
        message: `User ${user.username} logged in successfully`,
      };
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async refreshTokenAdmin(req: Request, res: Response) {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const refreshToken = cookies.refreshToken;

    const foundUser = await this.userModel.findOne({ refreshToken });
    if (!foundUser) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const payload: JWTPayload = {
      _id: foundUser._id as string,
      username: foundUser.username,
      email: foundUser.email,
      roles: foundUser.roles,
    };

    try {
      const decoded: JWTPayload = this.jwtRefreshService.verify(refreshToken);

      if (foundUser.username !== decoded.username) {
        throw new ForbiddenException('Token user mismatch');
      }

      const accessToken: string = this.jwtService.sign(payload);

      return {
        accessToken,
        message: `Access token refreshed successfully`,
      };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async logoutAdmin(req: Request, res: Response) {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      return false;
    }

    const refreshToken = cookies.refreshToken;
    const foundUser = await this.userModel.findOne({ refreshToken });

    if (!foundUser) {
      res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
      });
      throw new UnauthorizedException();
    }

    try {
      foundUser.refreshToken = undefined;
      await foundUser.save();

      res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
      });
      return true;
    } catch (error) {
      console.error('Error while logging out:', error);
      return false;
    }
  }
}
