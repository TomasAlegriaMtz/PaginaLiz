import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentCategory extends Document {
  name: string;
  slug: string;
  subjectId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure uniqueness of a category slug ONLY within the same subject
DocumentCategorySchema.index({ subjectId: 1, slug: 1 }, { unique: true });

export default mongoose.models.DocumentCategory || mongoose.model<IDocumentCategory>('DocumentCategory', DocumentCategorySchema);
