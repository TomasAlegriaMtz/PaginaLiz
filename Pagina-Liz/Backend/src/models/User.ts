import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password_hash: { type: String, required: true },
    role: { type: String, required: true, enum: ['ADMIN'], default: 'ADMIN' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
