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
} from '@nestjs/swagger';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { User } from 'src/decorators/user.decorator';
import { UserJWTResponse } from 'src/auth/types/jwt.types';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { UserRoles } from 'src/auth/roles/user-roles.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Warranty } from './entities/warranty.entity';
import { ObjectIdValidationPipe } from 'src/pipes/object-id-validation.pipe';
import { Response } from 'express';
import { WarrantiesPaginatedParamsDto } from './dto/warranties-paginated-params.dto';

@ApiBearerAuth()
@ApiTags('Warranties')
@Controller('warranties')
export class WarrantiesController {
  constructor(private readonly warrantiesService: WarrantiesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('invoice'))
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
    type: Warranty,
  })
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
  @ApiOperation({ summary: 'Get all warranties of the current installer' })
  @ApiOkResponse({
    description: 'List of warranties owned by the current user.',
    type: [Warranty],
  })
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
    type: Warranty,
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
  @ApiOperation({ summary: 'Get all warranties (Admin only)' })
  @ApiOkResponse({
    description: 'Paginated list of all warranties.',
    type: [Warranty],
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
    type: Warranty,
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
    schema: {
      example: {
        message:
          'Warranty with ID 65e732946f2f3b13a9a8035c deleted successfully',
      },
    },
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
