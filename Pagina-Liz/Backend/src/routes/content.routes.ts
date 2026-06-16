import express from 'express';
import { getContent, updateContent } from '../controllers/content.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/:slug')
  .get(getContent)
  .put(protect, updateContent);

export default router;
