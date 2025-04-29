import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { validate } from './config/env.validation';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './auth/entities/user.entity';
import { DatabaseSeeder } from './seeders/database-seeder.service';
import { UsersModule } from './users/users.module';
import { WarrantiesModule } from './warranties/warranties.module';
import { OcrModule } from './ocr/ocr.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    UsersModule,
    WarrantiesModule,
    OcrModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseSeeder],
})
export class AppModule {}
