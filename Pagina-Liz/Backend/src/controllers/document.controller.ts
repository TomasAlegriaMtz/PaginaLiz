import { Request, Response } from 'express';
import DocumentModel from '../models/Document';
import DocumentContent from '../models/DocumentContent';
import '../models/DocumentCategory';
import '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';
import { extractText } from '../utils/textExtractor';
import fs from 'fs';
import path from 'path';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, categoryId, description, lang } = req.body;
    const fileLang = lang === 'en' ? 'en' : 'es';

    if (!title || !categoryId) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Title and categoryId are required' });
    }

    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`
    };

    const newDoc = new DocumentModel({
      title,
      description,
      categoryId,
      uploaderId: req.user?.id,
      [fileLang]: fileData
    });

    const savedDoc = await newDoc.save();

    // Extract text and save to DocumentContent
    try {
      const extractedText = await extractText(req.file.path);
      await DocumentContent.findOneAndUpdate(
        { documentId: savedDoc._id, lang: fileLang },
        { content: extractedText, extractedAt: new Date() },
        { upsert: true, new: true }
      );
    } catch (extractError) {
      console.error('Text extraction failed (non-fatal):', extractError);
    }

    const populatedDoc = await DocumentModel.findById(savedDoc._id)
      .populate('categoryId', 'name slug subjectId')
      .populate('uploaderId', 'username');

    res.status(201).json(populatedDoc);
  } catch (error: any) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadDocumentLang = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { lang } = req.body;
    const fileLang = lang === 'en' ? 'en' : 'es';
    const doc = await DocumentModel.findById(req.params.id);

    if (!doc) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete old file if exists for this lang
    const oldLangData = doc[fileLang];
    if (oldLangData && oldLangData.path) {
      const oldFilePath = path.join(__dirname, '../../../data', oldLangData.path);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update lang file data
    doc[fileLang] = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`
    };
    await doc.save();

    // Extract text
    try {
      const extractedText = await extractText(req.file.path);
      await DocumentContent.findOneAndUpdate(
        { documentId: doc._id, lang: fileLang },
        { content: extractedText, extractedAt: new Date() },
        { upsert: true, new: true }
      );
    } catch (extractError) {
      console.error('Text extraction failed (non-fatal):', extractError);
    }

    const populatedDoc = await DocumentModel.findById(doc._id)
      .populate('categoryId', 'name slug subjectId')
      .populate('uploaderId', 'username');

    res.json(populatedDoc);
  } catch (error: any) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { categoryId } : {};

    const documents = await DocumentModel.find(filter)
      .populate('categoryId', 'name slug subjectId')
      .populate('uploaderId', 'username')
      .sort({ uploadDate: -1 });

    res.json(documents);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDocumentText = async (req: Request, res: Response) => {
  try {
    const { lang } = req.query;
    const fileLang = lang === 'en' ? 'en' : 'es';

    const content = await DocumentContent.findOne({
      documentId: req.params.id,
      lang: fileLang
    });

    if (!content) {
      return res.status(404).json({ message: 'No content found for this language' });
    }

    res.json({ content: content.content, lang: fileLang, extractedAt: content.extractedAt });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDocumentLang = async (req: AuthRequest, res: Response) => {
  try {
    const { lang } = req.params;
    const fileLang = lang === 'en' ? 'en' : 'es';
    const doc = await DocumentModel.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const langData = doc[fileLang];
    if (langData && langData.path) {
      const filePath = path.join(__dirname, '../../../data', langData.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    doc[fileLang] = null;
    await doc.save();

    await DocumentContent.deleteMany({ documentId: doc._id, lang: fileLang });

    const populatedDoc = await DocumentModel.findById(doc._id)
      .populate('categoryId', 'name slug subjectId')
      .populate('uploaderId', 'username');

    res.json(populatedDoc);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const doc = await DocumentModel.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete physical files for both languages
    for (const lang of ['es', 'en'] as const) {
      const langData = doc[lang];
      if (langData && langData.path) {
        const filePath = path.join(__dirname, '../../../data', langData.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Cascade delete DocumentContent
    await DocumentContent.deleteMany({ documentId: doc._id });

    await doc.deleteOne();
    res.json({ message: 'Document removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, categoryId } = req.body;
    const doc = await DocumentModel.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (title) doc.title = title;
    if (description !== undefined) doc.description = description;
    if (categoryId) doc.categoryId = categoryId;

    const savedDoc = await doc.save();
    const populatedDoc = await DocumentModel.findById(savedDoc._id)
      .populate('categoryId', 'name slug subjectId')
      .populate('uploaderId', 'username');

    res.json(populatedDoc);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
