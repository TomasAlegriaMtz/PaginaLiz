import { Request, Response } from 'express';
import Subject from '../models/Subject';

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await Subject.find({ isActive: true }).sort({ createdAt: 1 });
    res.json(subjects);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newSubject = new Subject({
      name,
      slug
    });

    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subject with this name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.json({ message: 'Subject deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
