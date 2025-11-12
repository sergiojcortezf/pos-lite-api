import { Router } from 'express';
import { UsersController } from './users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

import { validationMiddleware } from '../middlewares/validation.middleware';
import { UpdateProfileDto } from './dtos/update-profile.dto';

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
  validationMiddleware(UpdateProfileDto),
  controller.updateProfile
);

export default router;