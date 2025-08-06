import { Router, Response } from 'express';
import { getSupabaseClient } from '../utils/supabase';
import { logger } from '../utils/logger';
import { 
  authenticateUser, 
  requireRole, 
  requireUserAccess, 
  requireAdminForRoleChanges,
  AuthenticatedRequest 
} from '../middleware/auth';

const router = Router();

// Database types
interface CreateUserRequest {
  email?: string | null;
  role: 'admin' | 'client' | 'talent';
}

interface UpdateUserRequest {
  email?: string | null;
  role?: 'admin' | 'client' | 'talent';
}

// GET /api/users - Get all users (admin only)
router.get('/', 
  authenticateUser,
  requireRole(['admin']),
  async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const supabase = getSupabaseClient();
      
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error(`Error fetching users: ${error.message}`);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch users',
        });
      }

      return res.json({
        success: true,
        data: users || [],
      });
    } catch (error) {
      logger.error(`Error fetching users: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch users',
      });
    }
  }
);

// POST /api/users - Create a new user
router.post('/', 
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email, role }: CreateUserRequest = req.body;
      
      if (!role) {
        return res.status(400).json({
          success: false,
          error: 'role is required',
        });
      }

      if (!['admin', 'client', 'talent'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be admin, client, or talent',
        });
      }

      const supabase = getSupabaseClient();
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', req.authenticatedUser!.clerkUserId)
        .single();

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists',
        });
      }

      // Create user
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          clerk_user_id: req.authenticatedUser!.clerkUserId,
          email: email || null,
          role: role,
        })
        .select()
        .single();

      if (error) {
        logger.error(`Error creating user: ${error.message}`);
        return res.status(500).json({
          success: false,
          error: 'Failed to create user',
        });
      }

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error(`Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to create user',
      });
    }
  }
);

// GET /api/users/:clerkUserId - Get user by Clerk user ID
router.get('/:clerkUserId', 
  authenticateUser,
  requireUserAccess,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { clerkUserId } = req.params;
      
      if (!clerkUserId) {
        return res.status(400).json({
          success: false,
          error: 'clerkUserId is required',
        });
      }
      
      const supabase = getSupabaseClient();
      
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            error: 'User not found',
          });
        }
        logger.error(`Error fetching user: ${error.message}`);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch user',
        });
      }

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error(`Error fetching user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user',
      });
    }
  }
);

// PUT /api/users/:clerkUserId - Update user by Clerk user ID
router.put('/:clerkUserId', 
  authenticateUser,
  requireUserAccess,
  requireAdminForRoleChanges,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { clerkUserId } = req.params;
      const updates: UpdateUserRequest = req.body;
      
      if (!clerkUserId) {
        return res.status(400).json({
          success: false,
          error: 'clerkUserId is required',
        });
      }

      // Validate role if provided
      if (updates.role && !['admin', 'client', 'talent'].includes(updates.role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be admin, client, or talent',
        });
      }

      const supabase = getSupabaseClient();
      
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Update user
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updates)
        .eq('clerk_user_id', clerkUserId)
        .select()
        .single();

      if (error) {
        logger.error(`Error updating user: ${error.message}`);
        return res.status(500).json({
          success: false,
          error: 'Failed to update user',
        });
      }

      return res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      logger.error(`Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to update user',
      });
    }
  }
);

// DELETE /api/users/:clerkUserId - Delete user by Clerk user ID
router.delete('/:clerkUserId', 
  authenticateUser,
  requireRole(['admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { clerkUserId } = req.params;
      
      if (!clerkUserId) {
        return res.status(400).json({
          success: false,
          error: 'clerkUserId is required',
        });
      }

      const supabase = getSupabaseClient();
      
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single();

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Delete user
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_user_id', clerkUserId);

      if (error) {
        logger.error(`Error deleting user: ${error.message}`);
        return res.status(500).json({
          success: false,
          error: 'Failed to delete user',
        });
      }

      return res.json({
        success: true,
        data: existingUser, // Return the deleted user data
      });
    } catch (error) {
      logger.error(`Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete user',
      });
    }
  }
);

export default router; 