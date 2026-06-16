import mongoose, { Document, Schema } from 'mongoose';

export interface IPageContent extends Document {
  slug: string;
  data: any;
  updatedAt: Date;
}

const PageContentSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPageContent>('PageContent', PageContentSchema);
