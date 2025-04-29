import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  Body,
  Delete,
  Put,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { UserRoles } from 'src/auth/roles/user-roles.enum';
import { ObjectIdValidationPipe } from 'src/pipes/object-id-validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { UserResponse } from './dto/user-response.dto';
import { UsersPaginatedParamsDto } from './dto/users-paginated-params.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Retrieve all users with pagination, sorting, and search',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async findAll(
    @Query() query: UsersPaginatedParamsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.usersService.findAll(query);

    const transformedData = data.map(
      (user) =>
        new UserResponse(
          user.id,
          user.username,
          user.email,
          user.roles,
          user.bio,
          user.createdAt,
          user.updatedAt,
        ),
    );

    res.set('Content-Range', `users 0-${transformedData.length - 1}/${total}`);

    return transformedData;
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID (Mongo ObjectId)',
  })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized (Missing or invalid token)',
  })
  @ApiForbiddenResponse({ description: 'Forbidden (Role not allowed)' })
  findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID (Mongo ObjectId)',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized (Missing or invalid token)',
  })
  @ApiForbiddenResponse({ description: 'Forbidden (Role not allowed)' })
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return new UserResponse(
      updatedUser?._id as string,
      updatedUser!.username,
      updatedUser!.email,
      updatedUser!.roles,
      updatedUser!.bio,
      updatedUser!.createdAt,
      updatedUser!.updatedAt,
    );
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID (Mongo ObjectId)',
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized (Missing or invalid token)',
  })
  @ApiForbiddenResponse({ description: 'Forbidden (Role not allowed)' })
  async remove(@Param('id', ObjectIdValidationPipe) id: string) {
    const removedUser = await this.usersService.remove(id);

    return new UserResponse(
      removedUser?._id as string,
      removedUser!.username,
      removedUser!.email,
      removedUser!.roles,
      removedUser!.bio,
      removedUser!.createdAt,
      removedUser!.updatedAt,
    );
  }
}
