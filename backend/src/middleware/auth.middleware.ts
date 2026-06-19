import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, UserPayload } from '../types';

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  // Expecting format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required. Please sign in.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'Internal Server Error: Security token secret configuration is missing.' });
      return;
    }
    const decoded = jwt.verify(token, secret) as UserPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Session expired or invalid token. Please sign in again.' });
  }
}
