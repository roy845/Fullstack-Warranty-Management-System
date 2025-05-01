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
  ApiOkResponse,
  ApiTags,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
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
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { UnauthorizedResponseDto } from 'src/common/unauthorized-response.dto';
import { ForbiddenResponseDto } from 'src/common/forbidden-response.dto';
import { InvalidIdResponseDto } from 'src/common/invalid-id-response.dto';
import { UserNotFoundResponseDto } from './dto/user-not-found-response.do';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiOperation({
    summary:
      'Retrieve all users with pagination, sorting, and search (Admin only)',
  })
  @ApiOkResponse({
    description: 'List of users retrieved successfully',
    type: PaginatedUsersResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiForbiddenResponse({
    description: 'Access denied due to missing roles or permissions',
    type: ForbiddenResponseDto,
  })
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

    return { data: transformedData, total };
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID (Mongo ObjectId)',
    example: '60f7e2462b4cfe001c2f7b7a',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: InvalidIdResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserNotFoundResponseDto,
  })
  findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID (Mongo ObjectId)',
    example: '60f7e2462b4cfe001c2f7b7a',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: InvalidIdResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserNotFoundResponseDto,
  })
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
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID (Mongo ObjectId)',
    example: '60f7e2462b4cfe001c2f7b7a',
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: InvalidIdResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: UserNotFoundResponseDto,
  })
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
