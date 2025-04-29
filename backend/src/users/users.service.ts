import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from 'src/auth/entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthEnum } from 'src/auth/constants/auth-constants';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserResponse } from './dto/user-response.dto';
import { UsersPaginatedParamsDto } from './dto/users-paginated-params.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(query: UsersPaginatedParamsDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
    } = query;

    const skip = (page - 1) * limit;

    const sortField = sortBy === 'email' ? 'email' : sortBy;
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

    const searchFilter = search
      ? {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.userModel
        .find(searchFilter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit),
      this.userModel.countDocuments(searchFilter),
    ]);

    return { data, total };
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('id username email roles bio createdAt updatedAt');

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserResponse(
      user._id as string,
      user.username,
      user.email,
      user.roles,
      user.bio,
      user.createdAt,
      user.updatedAt,
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        AuthEnum.SALT_ROUNDS,
      );
    }

    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      })
      .select('username email roles bio createdAt updatedAt');
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.userModel
      .findByIdAndDelete(id)
      .select('username email roles bio createdAt updatedAt');
  }
}
