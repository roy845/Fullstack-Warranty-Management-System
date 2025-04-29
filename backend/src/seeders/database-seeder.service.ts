import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRoles } from 'src/auth/roles/user-roles.enum';
import { User, UserDocument } from 'src/auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const existingUser = await this.userModel.findOne({
      email: 'royatali94@gmail.com',
    });

    if (!existingUser) {
      const user = new this.userModel({
        username: 'royatali94',
        email: 'royatali94@gmail.com',
        password: this.configService.get<string>('ADMIN_USER_PASSWORD'),
        roles: [UserRoles.USER, UserRoles.ADMIN],
      });
      await user.save();

      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists, skipping seeding.');
    }
  }
}
