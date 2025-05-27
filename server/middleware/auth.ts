import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include session data
declare global {
  namespace Express {
    interface Session {
      userId?: number;
      userEmail?: string;
      tenantId?: number;
      userRole?: string;
    }
  }
}

// Middleware to require authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Middleware to require tenant access
export const requireTenant = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.tenantId) {
    return res.status(403).json({ error: 'Tenant access required' });
  }
  next();
};

// Middleware for role-based access control
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.userRole || req.session.userRole !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Middleware to check if user is authenticated (for optional auth)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  // This middleware doesn't block, just adds user info if available
  next();
};