import mongoose, { Document, Schema } from 'mongoose';

interface LangFile {
  filename: string;
  originalName: string;
  path: string;
}

export interface IDocumentModel extends Document {
  title: string;
  description?: string;
  categoryId: mongoose.Types.ObjectId;
  uploaderId: mongoose.Types.ObjectId;
  uploadDate: Date;
  es?: LangFile | null;
  en?: LangFile | null;
}

const LangFileSchema = new Schema({
  filename: { type: String },
  originalName: { type: String },
  path: { type: String }
}, { _id: false });

const DocumentSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'DocumentCategory', required: true },
  uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDate: { type: Date, default: Date.now },
  es: { type: LangFileSchema, default: null },
  en: { type: LangFileSchema, default: null }
});

export default mongoose.model<IDocumentModel>('Document', DocumentSchema);
