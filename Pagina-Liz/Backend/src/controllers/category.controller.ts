import { Request, Response } from 'express';
import DocumentCategory from '../models/DocumentCategory';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await DocumentCategory.find({ isActive: true })
      .populate('subjectId')
      .sort({ createdAt: 1 });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, subjectId } = req.body;
    if (!name || !subjectId) return res.status(400).json({ message: 'Name and subjectId are required' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCategory = new DocumentCategory({
      name,
      slug,
      subjectId
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await DocumentCategory.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
