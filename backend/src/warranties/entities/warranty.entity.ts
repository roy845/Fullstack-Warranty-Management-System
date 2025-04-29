import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WarrantyStatus } from '../types/warranty.types';

@Schema({ timestamps: true, versionKey: false })
export class Warranty extends Document {
  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true })
  productInfo: string;

  @Prop({ required: true })
  installationDate: Date;

  @Prop({ required: true })
  invoiceFilename: string;

  @Prop({
    type: String,
    enum: WarrantyStatus,
    default: WarrantyStatus.pending,
  })
  status: WarrantyStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const WarrantySchema = SchemaFactory.createForClass(Warranty);
