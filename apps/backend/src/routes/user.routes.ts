import { Router } from 'express';
import { getUserData, updateUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:id', authMiddleware, getUserData);
router.put('/:id', authMiddleware, updateUser);

export default router;