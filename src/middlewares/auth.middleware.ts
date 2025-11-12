import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { envs } from '../config/envs';
import { AppError } from '../utils/AppError';

interface JwtPayload {
  id: string;
  email: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new AppError('No se proporcionó token de autenticación.', 401));
  }

  if (!authorization.startsWith('Bearer ')) {
    return next(new AppError('Token en formato inválido.', 401));
  }

  const token = authorization.split(' ')[1] || '';

  try {
    const decoded = jwt.verify(token, envs.jwtSecret) as JwtPayload;
    req.user = decoded;    
    next();

  } catch (error) {
    next(new AppError('Token no válido o expirado.', 401));
  }
};