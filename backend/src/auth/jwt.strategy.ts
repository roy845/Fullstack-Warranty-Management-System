import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWTPayload, UserJWTResponse } from './types/jwt.types';
import { User, UserDocument } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),

      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JWTPayload): Promise<UserJWTResponse> {
    const { _id } = payload;

    const user = await this.userModel.findOne({ _id });

    if (!user) {
      throw new UnauthorizedException();
    }

    const userResponse = {
      _id: user._id as string,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };

    return userResponse;
  }
}
