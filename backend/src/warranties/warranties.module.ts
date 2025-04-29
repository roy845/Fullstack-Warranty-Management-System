import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WarrantiesService } from './warranties.service';
import { WarrantiesController } from './warranties.controller';
import { Warranty, WarrantySchema } from './entities/warranty.entity';
import { OcrModule } from '../ocr/ocr.module';

@Module({
  imports: [
    OcrModule,
    MongooseModule.forFeature([
      { name: Warranty.name, schema: WarrantySchema },
    ]),
  ],
  controllers: [WarrantiesController],
  providers: [WarrantiesService],
})
export class WarrantiesModule {}
