import { Router } from 'express';
import { AuthController } from './auth.controller';

import { validationMiddleware } from '../middlewares/validation.middleware';

import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

const controller = new AuthController();
const router = Router();

router.post(
  '/register', 
  validationMiddleware(RegisterUserDto),
  controller.register
);

router.post(
  '/login', 
  validationMiddleware(LoginUserDto),
  controller.login
);

export default router;