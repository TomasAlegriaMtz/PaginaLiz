import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);
