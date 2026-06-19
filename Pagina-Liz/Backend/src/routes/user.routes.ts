import express from 'express';
import { getUsers, createUser, toggleUserStatus } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', protect, getUsers);
router.post('/', protect, createUser); // TODO: Add role checking middleware if needed
router.patch('/:id/toggle', protect, toggleUserStatus);

export default router;
