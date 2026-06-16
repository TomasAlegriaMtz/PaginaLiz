import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const uploadAsset = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Construct public URL
  const publicUrl = `/assets/${req.file.filename}`;

  res.status(201).json({
    message: 'Asset uploaded successfully',
    url: publicUrl,
    filename: req.file.filename,
    originalName: req.file.originalname
  });
};

export const listAssets = (req: Request, res: Response) => {
  const assetsDir = path.join(__dirname, '../../../data/assets');
  
  if (!fs.existsSync(assetsDir)) {
    return res.json([]);
  }

  fs.readdir(assetsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading assets directory' });
    }
    
    const assets = files.map(file => ({
      url: `/assets/${file}`,
      filename: file
    }));
    
    res.json(assets);
  });
};

export const deleteAsset = (req: Request, res: Response) => {
  const filename = req.params.filename;
  if (!filename) return res.status(400).json({ message: 'Filename required' });

  // Prevenir directory traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(__dirname, '../../../data/assets', safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Asset not found' });
  }

  try {
    fs.unlinkSync(filePath);
    res.json({ message: 'Asset deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting asset', error: error.message });
  }
};
