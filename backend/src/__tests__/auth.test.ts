import request from 'supertest';
import express from 'express';
import { 
  authenticateUser, 
  requireRole, 
  requireUserAccess, 
  requireAdminForRoleChanges,
  AuthenticatedRequest 
} from '../middleware/auth';
import { getSupabaseClient } from '../utils/supabase';

// Mock Supabase client
jest.mock('../utils/supabase');
const mockSupabase = getSupabaseClient as jest.MockedFunction<typeof getSupabaseClient>;

// Mock logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Authentication Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid authorization header', async () => {
      const mockUser = {
        clerk_user_id: 'user_123',
        role: 'client' as const,
        email: 'test@example.com',
      };

      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
            }),
          }),
        }),
      } as any);

      app.get('/test', authenticateUser, (req: AuthenticatedRequest, res) => {
        res.json({ 
          success: true, 
          user: req.authenticatedUser 
        });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Bearer user_123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toEqual({
        clerkUserId: 'user_123',
        role: 'client',
        email: 'test@example.com',
      });
    });

    it('should return 401 for missing authorization header', async () => {
      app.get('/test', authenticateUser, (_req, res) => {
        res.json({ success: true });
      });

      await request(app)
        .get('/test')
        .expect(401)
        .expect({
          success: false,
          error: 'Unauthorized - Missing or invalid authorization header',
        });
    });

    it('should return 401 for invalid authorization header format', async () => {
      app.get('/test', authenticateUser, (_req, res) => {
        res.json({ success: true });
      });

      await request(app)
        .get('/test')
        .set('Authorization', 'InvalidFormat user_123')
        .expect(401)
        .expect({
          success: false,
          error: 'Unauthorized - Missing or invalid authorization header',
        });
    });

    it('should return 401 for non-existent user', async () => {
      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
            }),
          }),
        }),
      } as any);

      app.get('/test', authenticateUser, (_req, res) => {
        res.json({ success: true });
      });

      await request(app)
        .get('/test')
        .set('Authorization', 'Bearer user_123')
        .expect(401)
        .expect({
          success: false,
          error: 'Unauthorized - User not found or invalid',
        });
    });
  });

  describe('requireRole', () => {
    it('should allow access for user with required role', async () => {
      const mockUser = {
        clerk_user_id: 'user_123',
        role: 'admin' as const,
        email: 'admin@example.com',
      };

      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
            }),
          }),
        }),
      } as any);

      app.get('/test', 
        authenticateUser, 
        requireRole(['admin']), 
        (req: AuthenticatedRequest, res) => {
          res.json({ success: true, user: req.authenticatedUser });
        }
      );

      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Bearer user_123')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should deny access for user without required role', async () => {
      const mockUser = {
        clerk_user_id: 'user_123',
        role: 'client' as const,
        email: 'client@example.com',
      };

      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
            }),
          }),
        }),
      } as any);

      app.get('/test', 
        authenticateUser, 
        requireRole(['admin']), 
        (_req, res) => {
          res.json({ success: true });
        }
      );

      await request(app)
        .get('/test')
        .set('Authorization', 'Bearer user_123')
        .expect(403)
        .expect({
          success: false,
          error: 'Forbidden - Access denied. Required roles: admin',
        });
    });
  });

  describe('requireUserAccess', () => {
    it('should allow admin to access any user', async () => {
      const mockUser = {
        clerk_user_id: 'admin_123',
        role: 'admin' as const,
        email: 'admin@example.com',
      };

      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
            }),
          }),
        }),
      } as any);

      app.get('/test/:clerkUserId', 
        authenticateUser, 
        requireUserAccess, 
        (req: AuthenticatedRequest, res) => {
          res.json({ success: true, user: req.authenticatedUser });
        }
      );

      const response = await request(app)
        .get('/test/user_456')
        .set('Authorization', 'Bearer admin_123')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should allow user to access their own data', async () => {
      const mockUser = {
        clerk_user_id: 'user_123',
        role: 'client' as const,
        email: 'client@example.com',
      };

      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
            }),
          }),
        }),
      } as any);

      app.get('/test/:clerkUserId', 
        authenticateUser, 
        requireUserAccess, 
        (req: AuthenticatedRequest, res) => {
          res.json({ success: true, user: req.authenticatedUser });
        }
      );

      const response = await request(app)
        .get('/test/user_123')
        .set('Authorization', 'Bearer user_123')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should deny user access to other user data', async () => {
      const mockUser = {
        clerk_user_id: 'user_123',
        role: 'client' as const,
        email: 'client@example.com',
      };

      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
            }),
          }),
        }),
      } as any);

      app.get('/test/:clerkUserId', 
        authenticateUser, 
        requireUserAccess, 
        (_req, res) => {
          res.json({ success: true });
        }
      );

      await request(app)
        .get('/test/user_456')
        .set('Authorization', 'Bearer user_123')
        .expect(403)
        .expect({
          success: false,
          error: 'Forbidden - You can only access your own data',
        });
    });
  });

  describe('requireAdminForRoleChanges', () => {
    it('should allow admin to change user role', async () => {
      const mockUser = {
        clerk_user_id: 'admin_123',
        role: 'admin' as const,
        email: 'admin@example.com',
      };

      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
            }),
          }),
        }),
      } as any);

      app.put('/test/:clerkUserId', 
        authenticateUser, 
        requireAdminForRoleChanges, 
        (req: AuthenticatedRequest, res) => {
          res.json({ success: true, body: req.body });
        }
      );

      const response = await request(app)
        .put('/test/user_456')
        .set('Authorization', 'Bearer admin_123')
        .send({ role: 'talent' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.body.role).toBe('talent');
    });

    it('should deny non-admin from changing user role', async () => {
      const mockUser = {
        clerk_user_id: 'user_123',
        role: 'client' as const,
        email: 'client@example.com',
      };

      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
            }),
          }),
        }),
      } as any);

      app.put('/test/:clerkUserId', 
        authenticateUser, 
        requireAdminForRoleChanges, 
        (_req, res) => {
          res.json({ success: true });
        }
      );

      await request(app)
        .put('/test/user_456')
        .set('Authorization', 'Bearer user_123')
        .send({ role: 'talent' })
        .expect(403)
        .expect({
          success: false,
          error: 'Forbidden - Only administrators can change user roles',
        });
    });

    it('should allow non-admin to update non-role fields', async () => {
      const mockUser = {
        clerk_user_id: 'user_123',
        role: 'client' as const,
        email: 'client@example.com',
      };

      mockSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
            }),
          }),
        }),
      } as any);

      app.put('/test/:clerkUserId', 
        authenticateUser, 
        requireAdminForRoleChanges, 
        (req: AuthenticatedRequest, res) => {
          res.json({ success: true, body: req.body });
        }
      );

      const response = await request(app)
        .put('/test/user_123')
        .set('Authorization', 'Bearer user_123')
        .send({ email: 'newemail@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.body.email).toBe('newemail@example.com');
    });
  });
}); 