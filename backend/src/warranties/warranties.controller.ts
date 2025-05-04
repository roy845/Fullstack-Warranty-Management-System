import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Res,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { WarrantiesService } from './warranties.service';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { User } from 'src/decorators/user.decorator';
import { UserJWTResponse } from 'src/auth/types/jwt.types';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { UserRoles } from 'src/auth/roles/user-roles.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ObjectIdValidationPipe } from 'src/pipes/object-id-validation.pipe';
import { Response } from 'express';
import { WarrantiesPaginatedParamsDto } from './dto/warranties-paginated-params.dto';
import { fileFilter } from 'src/filters/file-filter.filter';
import { WarrantyResponseDto } from './dto/warranty-response.dto';
import { PaginatedWarrantiesResponseDto } from './dto/paginated-warranties-response.dto';
import { UnauthorizedResponseDto } from 'src/common/unauthorized-response.dto';
import { NoInvoiceFileResponseDto } from './dto/no-invoice-file-response.dto';
import { ForbiddenResponseDto } from 'src/common/forbidden-response.dto';
import { InvalidIdResponseDto } from 'src/common/invalid-id-response.dto';
import { WarrantyNotFoundResponseDto } from './dto/warranty-not-found-response.dto';

@ApiBearerAuth()
@ApiTags('Warranties')
@Controller('warranties')
export class WarrantiesController {
  constructor(private readonly warrantiesService: WarrantiesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('invoice', { fileFilter }))
  @ApiOperation({ summary: 'Create warranty' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Warranty activation form with invoice file',
    required: true,
    schema: {
      type: 'object',
      properties: {
        invoice: { type: 'string', format: 'binary' },
        clientName: { type: 'string' },
        productInfo: { type: 'string' },
        installationDate: { type: 'string', format: 'date' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Warranty created successfully.',
    type: WarrantyResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invoice file is required',
    type: NoInvoiceFileResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Only users can create warranties' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.USER)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createWarrantyDto: CreateWarrantyDto,
    @User() user: UserJWTResponse,
  ) {
    return await this.warrantiesService.create(
      createWarrantyDto,
      file,
      user._id,
    );
  }

  @Get('mine')
  @ApiOperation({
    summary:
      'Get all warranties of the current logged in installer with pagination, sorting, and search',
  })
  @ApiOkResponse({
    description: 'List of warranties owned by the current user.',
    type: PaginatedWarrantiesResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.USER)
  async findMine(
    @User() user: UserJWTResponse,
    @Query() query: WarrantiesPaginatedParamsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.warrantiesService.findMine(
      user._id,
      query,
    );

    const transformedData = data.map((warranty) => ({
      id: warranty._id,
      ...warranty.toObject(),
    }));

    res.set(
      'Content-Range',
      `warranties 0-${transformedData.length - 1}/${total}`,
    );

    return { data: transformedData, total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warranty by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the warranty to retrieve',
    type: String,
  })
  @ApiOkResponse({
    description: 'Warranty details retrieved successfully.',
    type: WarrantyResponseDto,
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
  @ApiBadRequestResponse({
    description: 'Invalid ObjectId format',
    type: InvalidIdResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Warranty not found',
    type: WarrantyNotFoundResponseDto,
  })
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const warranty = await this.warrantiesService.findOne(id);
    return {
      id: warranty._id,
      ...warranty.toObject(),
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Retrieve all warranties with pagination, sorting, and search (Admin only)',
  })
  @ApiOkResponse({
    description: 'Paginated list of all warranties.',
    type: PaginatedWarrantiesResponseDto,
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
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async findAll(
    @Query() query: WarrantiesPaginatedParamsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.warrantiesService.findAll(query);

    const transformedData = data.map((warranty) => ({
      id: warranty._id,
      ...warranty.toObject(),
    }));

    res.set(
      'Content-Range',
      `warranties 0-${transformedData.length - 1}/${total}`,
    );

    return { data: transformedData, total };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a warranty (Admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the warranty to update',
    type: String,
  })
  @ApiOkResponse({
    description: 'Warranty updated successfully.',
    type: WarrantyResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ObjectId format or No fields provided for update',
    type: InvalidIdResponseDto,
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
  @ApiNotFoundResponse({
    description: 'Warranty not found',
    type: WarrantyNotFoundResponseDto,
  })
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateWarrantyDto: UpdateWarrantyDto,
  ) {
    const updatedWarranty = await this.warrantiesService.update(
      id,
      updateWarrantyDto,
    );

    const { _id, ...rest } = updatedWarranty;

    return {
      id: _id.toString(),
      ...rest,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warranty by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the warranty to delete',
    type: String,
  })
  @ApiOkResponse({
    description: 'Warranty deleted successfully.',
    type: WarrantyResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ObjectId format',
    type: InvalidIdResponseDto,
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
  @ApiNotFoundResponse({
    description: 'Warranty not found',
    type: WarrantyNotFoundResponseDto,
  })
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async remove(@Param('id', ObjectIdValidationPipe) id: string) {
    const deletedWarranty = await this.warrantiesService.remove(id);

    const { _id, ...rest } = deletedWarranty;

    return {
      id: (_id as string).toString(),
      ...rest,
    };
  }
}
