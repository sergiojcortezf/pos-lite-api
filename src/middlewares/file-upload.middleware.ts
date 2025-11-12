import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { AppError } from '../utils/AppError';

const excelFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  
  if (file.mimetype === allowedMimeType) {
    cb(null, true); 
  } else {
      cb(new AppError('Formato de archivo inválido. Solo se acepta .xlsx', 400)); 
  }
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  fileFilter: excelFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Límite de 5MB
  }
});