import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import {
  jwtConfigProvider,
  jwtRefreshConfigProvider,
} from 'src/config/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    jwtConfigProvider,
    jwtRefreshConfigProvider,
  ],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
