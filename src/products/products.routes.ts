import { Router } from 'express';
import { ProductsController } from './products.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/file-upload.middleware';

import { validationMiddleware } from '../middlewares/validation.middleware';
import { checkRoleMiddleware } from '../middlewares/checkRole.middleware';

import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

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
  checkRoleMiddleware(['ADMIN']),
  validationMiddleware(CreateProductDto),
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
  checkRoleMiddleware(['ADMIN']),
  validationMiddleware(UpdateProductDto),
  controller.update
);

router.delete(
  '/:id', 
  authMiddleware,
  checkRoleMiddleware(['ADMIN']),
  controller.delete
);

// --- CARGA DE ARCHIVOS ---
router.post(
  '/upload-catalog',
  authMiddleware,
  checkRoleMiddleware(['ADMIN']),
  upload.single('file'),
  controller.uploadCatalog
);

export default router;