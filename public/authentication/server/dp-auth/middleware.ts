import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from './jwt';

// Extend Express Request object to hold our user payload
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to enforce Role-Based Access Control (RBAC).
 * Intercepts requests, decodes JWT, and checks clearance against minLevel.
 * 
 * @param minLevel Minimum role level required (1-5)
 */
export function requireAuthLevel(minLevel: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedUser = verifyAccessToken(token);
      
      // Attach the decoded user to the request for downstream use
      req.user = decodedUser;

      // Check role level clearance
      if (decodedUser.roleLevel < minLevel) {
        return res.status(403).json({ 
          error: 'Forbidden: Insufficient clearance level',
          requiredLevel: minLevel,
          userLevel: decodedUser.roleLevel
        });
      }

      // Clearance granted
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }
  };
}
