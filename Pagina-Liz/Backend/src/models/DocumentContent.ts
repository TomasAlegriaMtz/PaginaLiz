import mongoose, { Schema, Document as MongoDocument } from 'mongoose';

export interface IDocumentContent extends MongoDocument {
  documentId: mongoose.Types.ObjectId;
  lang: 'es' | 'en';
  content: string;
  extractedAt: Date;
}

const DocumentContentSchema: Schema = new Schema({
  documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
  lang: { type: String, enum: ['es', 'en'], required: true },
  content: { type: String, default: '' },
  extractedAt: { type: Date, default: Date.now }
});

DocumentContentSchema.index({ documentId: 1, lang: 1 }, { unique: true });

export default mongoose.model<IDocumentContent>('DocumentContent', DocumentContentSchema);
