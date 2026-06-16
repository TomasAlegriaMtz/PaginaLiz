import express from 'express';
import { uploadDocument, getDocuments, deleteDocument, updateDocument } from '../controllers/document.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

router.route('/')
  .get(getDocuments)
  .post(protect, upload.single('file'), uploadDocument);

router.route('/:id')
  .put(protect, upload.single('file'), updateDocument)
  .delete(protect, deleteDocument);

export default router;
