import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { envs } from '../config/envs';

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
    return res.status(401).json({ message: 'No se proveyó un token.' });
  }

  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token en formato inválido.' });
  }

  const token = authorization.split(' ')[1] || '';

  try {
    const decoded = jwt.verify(token, envs.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Token no válido o expirado.' });
  }
};