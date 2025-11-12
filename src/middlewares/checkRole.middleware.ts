import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Genera un middleware que comprueba si el usuario autenticado
 * tiene (al menos) uno de los roles permitidos.
 * * Se debe usar DESPUÉS de 'authMiddleware'.
 * @param allowedRoles Array de roles permitidos (ej. ['ADMIN'])
 */
export const checkRoleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    const user = req.user;

    if (!user) {
      return next(new AppError('No autenticado.', 401));
    }

    const hasRole = user.roles.some(role => allowedRoles.includes(role));

    if (hasRole) {
      return next();
    }

    return next(new AppError('Acceso denegado. No tienes los permisos necesarios.', 403));
  };
};