import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { Warranty } from './entities/warranty.entity';
import { WarrantyStatus } from './types/warranty.types';
import { OCRService } from '../ocr/ocr.service';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { WarrantiesPaginatedParamsDto } from './dto/warranties-paginated-params.dto';

@Injectable()
export class WarrantiesService {
  constructor(
    @InjectModel(Warranty.name) private warrantyModel: Model<Warranty>,
    private readonly ocrService: OCRService,
  ) {}

  async create(
    createWarrantyDto: CreateWarrantyDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    const invoiceDate = await this.ocrService.parseInvoiceDate(file);
    let status: WarrantyStatus = WarrantyStatus.manual_review;

    if (invoiceDate) {
      const diffDays = Math.abs(
        (invoiceDate.getTime() -
          new Date(createWarrantyDto.installationDate).getTime()) /
          (1000 * 3600 * 24),
      );

      status =
        diffDays <= 21 ? WarrantyStatus.approved : WarrantyStatus.rejected;
    }

    const warranty = new this.warrantyModel({
      ...createWarrantyDto,
      invoiceFilename: file.originalname,
      status,
      user: userId,
    });

    return warranty.save();
  }

  async findMine(userId: string, query: WarrantiesPaginatedParamsDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
    } = query;

    const skip = (page - 1) * limit;
    const sortField = sortBy === 'clientName' ? 'clientName' : sortBy;
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

    const searchFilter = search
      ? {
          $and: [
            { user: userId },
            {
              $or: [
                { clientName: { $regex: search, $options: 'i' } },
                { productInfo: { $regex: search, $options: 'i' } },
              ],
            },
          ],
        }
      : { user: userId };

    const [data, total] = await Promise.all([
      this.warrantyModel
        .find(searchFilter)
        .populate('user', 'username email')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit),
      this.warrantyModel.countDocuments(searchFilter),
    ]);

    return { data, total };
  }

  async findOne(id: string) {
    const warranty = await this.warrantyModel.findById(id);

    if (!warranty) {
      throw new NotFoundException(`Warranty with ID ${id} not found`);
    }

    return warranty;
  }

  async findAll(query: WarrantiesPaginatedParamsDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
    } = query;

    const skip = (page - 1) * limit;

    const sortField = sortBy === 'clientName' ? 'clientName' : sortBy;
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

    const searchFilter = search
      ? {
          $or: [
            { clientName: { $regex: search, $options: 'i' } },
            { productInfo: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.warrantyModel
        .find(searchFilter)
        .populate('user', 'username email')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit),
      this.warrantyModel.countDocuments(searchFilter),
    ]);

    return { data, total };
  }

  async update(id: string, updateWarrantyDto: UpdateWarrantyDto) {
    if (!updateWarrantyDto || Object.keys(updateWarrantyDto).length === 0) {
      throw new BadRequestException('No fields provided for update');
    }

    const updatedWarranty = await this.warrantyModel
      .findByIdAndUpdate(id, updateWarrantyDto, { new: true, lean: true })
      .populate('user', 'email username _id');

    if (!updatedWarranty) {
      throw new NotFoundException(`Warranty with ID ${id} not found`);
    }

    return updatedWarranty;
  }

  async remove(id: string) {
    const deletedWarranty = await this.warrantyModel.findByIdAndDelete(id);

    if (!deletedWarranty) {
      throw new NotFoundException(`Warranty with ID ${id} not found`);
    }

    return deletedWarranty;
  }
}
