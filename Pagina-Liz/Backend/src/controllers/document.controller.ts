import { Request, Response } from 'express';
import DocumentModel from '../models/Document';
import '../models/DocumentCategory';
import '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';
import fs from 'fs';
import path from 'path';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, categoryId, description } = req.body;

    if (!title || !categoryId) {
      // Clean up the uploaded file since validation failed
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Title and categoryId are required' });
    }

    const newDoc = new DocumentModel({
      title,
      description,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      categoryId,
      uploaderId: req.user?.id
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (error: any) {
    if (req.file) {
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
      .populate('uploaderId', 'email')
      .sort({ uploadDate: -1 });
      
    res.json(documents);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const doc = await DocumentModel.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../../data', doc.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

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
      .populate('uploaderId', 'email');

    res.json(populatedDoc);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
