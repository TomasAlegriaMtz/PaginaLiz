import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/category.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, createCategory);

router.route('/:id')
  .delete(protect, deleteCategory);

export default router;
