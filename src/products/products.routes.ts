import { Router } from 'express';
import { ProductsController } from './products.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const controller = new ProductsController();
const router = Router();

router.get(
  '/', 
  authMiddleware,
  controller.findAll
);

router.post(
  '/', 
  authMiddleware,
  controller.create
);

router.get(
  '/:id', 
  authMiddleware,
  controller.findOne
);

router.put(
  '/:id', 
  authMiddleware,
  controller.update
);

router.delete(
  '/:id', 
  authMiddleware,
  controller.delete
);

export default router;