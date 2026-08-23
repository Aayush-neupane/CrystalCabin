import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/adminAuthService';

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token || !verifyToken(token)) {
    res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    return;
  }

  next();
}
