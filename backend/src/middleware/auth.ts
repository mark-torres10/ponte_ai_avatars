import { Request, Response, NextFunction } from 'express';
import { getSupabaseClient } from '../utils/supabase';
import { logger } from '../utils/logger';

// Extend Request interface to include authenticated user
export interface AuthenticatedRequest extends Request {
  authenticatedUser?: {
    clerkUserId: string;
    role: 'admin' | 'client' | 'talent';
    email?: string | null;
  };
}

/**
 * Authentication middleware that validates the Authorization header
 * and fetches the user from the database
 */
export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get user ID from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized - Missing or invalid authorization header',
      });
      return;
    }
    
    const clerkUserId = authHeader.replace('Bearer ', '');
    
    if (!clerkUserId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized - Invalid user ID',
      });
      return;
    }

    const supabase = getSupabaseClient();
    
    // Fetch user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error || !user) {
      logger.warn(`Authentication failed for user ${clerkUserId}: ${error?.message || 'User not found'}`);
      res.status(401).json({
        success: false,
        error: 'Unauthorized - User not found or invalid',
      });
      return;
    }

    // Add authenticated user to request object
    req.authenticatedUser = {
      clerkUserId: user.clerk_user_id,
      role: user.role,
      email: user.email,
    };

    logger.info(`User authenticated: ${user.clerk_user_id} (${user.role})`);
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication',
    });
    return;
  }
};

/**
 * Authorization middleware that checks if the authenticated user has the required role
 */
export const requireRole = (requiredRoles: ('admin' | 'client' | 'talent')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.authenticatedUser) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized - User not authenticated',
      });
      return;
    }

    if (!requiredRoles.includes(req.authenticatedUser.role)) {
      logger.warn(`Access denied: User ${req.authenticatedUser.clerkUserId} (${req.authenticatedUser.role}) attempted to access route requiring roles: ${requiredRoles.join(', ')}`);
      res.status(403).json({
        success: false,
        error: `Forbidden - Access denied. Required roles: ${requiredRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

/**
 * Authorization middleware that checks if the user can access/modify the specified user
 * Users can only access their own data, unless they are an admin
 */
export const requireUserAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.authenticatedUser) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized - User not authenticated',
    });
    return;
  }

  const targetUserId = req.params['clerkUserId'];
  
  if (!targetUserId) {
    res.status(400).json({
      success: false,
      error: 'Bad request - User ID is required',
    });
    return;
  }

  // Admins can access any user
  if (req.authenticatedUser.role === 'admin') {
    next();
    return;
  }

  // Users can only access their own data
  if (req.authenticatedUser.clerkUserId !== targetUserId) {
    logger.warn(`Access denied: User ${req.authenticatedUser.clerkUserId} attempted to access user ${targetUserId}`);
    res.status(403).json({
      success: false,
      error: 'Forbidden - You can only access your own data',
    });
    return;
  }

  next();
};

/**
 * Authorization middleware that restricts role changes to admin only
 */
export const requireAdminForRoleChanges = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.authenticatedUser) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized - User not authenticated',
    });
    return;
  }

  const updates = req.body;
  
  // If role is being changed, only admins can do this
  if (updates.role && req.authenticatedUser.role !== 'admin') {
    logger.warn(`Role change denied: User ${req.authenticatedUser.clerkUserId} (${req.authenticatedUser.role}) attempted to change role to ${updates.role}`);
    res.status(403).json({
      success: false,
      error: 'Forbidden - Only administrators can change user roles',
    });
    return;
  }

  next();
}; 