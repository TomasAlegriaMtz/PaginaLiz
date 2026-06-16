import express from 'express';
import { getSubjects, createSubject, deleteSubject } from '../controllers/subject.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getSubjects)
  .post(protect, createSubject);

router.route('/:id')
  .delete(protect, deleteSubject);

export default router;
