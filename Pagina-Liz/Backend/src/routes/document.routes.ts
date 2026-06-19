import express from 'express';
import { uploadDocument, uploadDocumentLang, getDocuments, getDocumentText, deleteDocument, updateDocument, deleteDocumentLang } from '../controllers/document.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

router.route('/')
  .get(getDocuments)
  .post(protect, upload.single('file'), uploadDocument);

router.get('/:id/text', getDocumentText);

router.route('/:id')
  .put(protect, updateDocument)
  .delete(protect, deleteDocument);

router.post('/:id/lang', protect, upload.single('file'), uploadDocumentLang);
router.delete('/:id/lang/:lang', protect, deleteDocumentLang);

export default router;
