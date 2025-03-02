import { Request, Response, NextFunction } from 'express';
import '../types/types';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session && req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};