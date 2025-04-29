import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ResetPassword {
  @Prop({ required: false, default: '' })
  token: string;

  @Prop({ required: false, default: new Date() })
  expiresAt: Date;
}
