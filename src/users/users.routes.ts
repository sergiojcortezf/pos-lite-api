import { Router } from 'express';
import { UsersController } from './users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const controller = new UsersController();
const router = Router();

router.get(
  '/profile', 
  authMiddleware,
  controller.getProfile
);

router.put(
  '/profile', 
  authMiddleware,
  controller.updateProfile
);

export default router;