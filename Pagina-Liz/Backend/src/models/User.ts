import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password_hash: string;
  role: 'MASTER' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, required: true, enum: ['MASTER', 'ADMIN'], default: 'ADMIN' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
