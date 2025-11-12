import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError } from '../utils/AppError';

/**
 * Genera un middleware que valida el 'req.body' contra una clase DTO.
 * @param dtoClass La clase DTO (ej. CreateProductDto)
 */
export const validationMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    
    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors.map(err => {
        return {
          property: err.property,
          constraints: err.constraints
        };
      });

      return next(new AppError(`Error de validación: ${JSON.stringify(errorMessages)}`, 400));
    }

    req.body = dtoInstance;
    
    next();
  };
};