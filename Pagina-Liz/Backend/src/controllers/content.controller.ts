import { Request, Response } from 'express';
import PageContent from '../models/PageContent';

export const getContent = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const content = await PageContent.findOne({ slug });
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data } = req.body;
    
    const content = await PageContent.findOneAndUpdate(
      { slug },
      { data },
      { new: true, upsert: true }
    );
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
