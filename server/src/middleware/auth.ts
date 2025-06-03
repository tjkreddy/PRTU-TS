import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/User';

interface AuthRequest extends Request {
  user?: UserDocument;
}

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'No token provided, authorization denied'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    // You would typically fetch the user from database here
    // For now, we'll attach the decoded token info
    req.user = decoded as any;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Token is not valid'
    });
  }
};

// Admin role middleware
const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      status: 'error',
      message: 'Not authenticated'
    });
    return;
  }

  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin privileges required.'
    });
    return;
  }

  next();
};

// Super admin middleware
const superAdminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      status: 'error',
      message: 'Not authenticated'
    });
    return;
  }

  if (req.user.role !== 'super_admin') {
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Super admin privileges required.'
    });
    return;
  }

  next();
};

export { authMiddleware, adminMiddleware, superAdminMiddleware };
export type { AuthRequest };
