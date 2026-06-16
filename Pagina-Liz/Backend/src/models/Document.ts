import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentModel extends Document {
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  path: string;
  categoryId: mongoose.Types.ObjectId;
  uploaderId: mongoose.Types.ObjectId;
  uploadDate: Date;
}

const DocumentSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'DocumentCategory', required: true },
  uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDate: { type: Date, default: Date.now }
});

export default mongoose.model<IDocumentModel>('Document', DocumentSchema);
