import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { QueryFailedError } from 'typeorm';

export const globalErrorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {

  console.error('--- ERROR NO MANEJADO ---');
  console.error('Path:', req.path);
  console.error('Error:', err.message);
  console.error('-------------------------');

  // Manejo de Errores Específicos
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // Manejo de errores de base de datos (ejemplo con TypeORM)
  if (err instanceof QueryFailedError) {
    const pgError = err as any;

    // '23505' = unique_violation (ej. barcode duplicado)
    if (pgError.code === '23505') {
      return res.status(400).json({
        message: 'Error: Ya existe un registro con uno de los valores únicos (ej. email o barcode).'
      });
    }

    // '22P02' = invalid_text_representation (ej. UUID con formato incorrecto)
    if (pgError.code === '22P02') {
      return res.status(400).json({
        message: 'Error: El ID proporcionado en la URL tiene un formato inválido.'
      });
    }
  }

  return res.status(500).json({
    message: 'Error interno del servidor.'
  });
};