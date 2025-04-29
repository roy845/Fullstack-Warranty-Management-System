import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AuthEnum } from '../constants/auth-constants';
import { UserRoles } from '../roles/user-roles.enum';
import { ResetPassword } from './reset-password.entity';
import { Bio } from './bio.entity';

export type UserDocument = User &
  Document & {
    comparePassword: (password: string) => Promise<boolean>;
  };

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [String],
    enum: Object.values(UserRoles),
    default: [UserRoles.USER],
  })
  roles: UserRoles[];

  @Prop({
    type: ResetPassword,
    required: false,
    default: () => ({}),
  })
  resetPassword?: ResetPassword;

  @Prop({ required: false })
  refreshToken?: string;

  @Prop({ type: Bio, default: () => ({}) })
  bio: Bio;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook for password hashing
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, AuthEnum.SALT_ROUNDS);
  next();
});

// Pre-update hook to update `updatedAt`
UserSchema.pre<UserDocument>('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Method to validate password
UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
