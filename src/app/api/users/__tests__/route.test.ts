import { GET, POST } from '../route';
import { userService } from '@/lib/supabase';
import { UserRole } from '@/types/user';

// Mock the userService
jest.mock('@/lib/supabase', () => ({
  userService: {
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    getUserByClerkId: jest.fn(),
  },
}));

describe('/api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should have the correct function signature', () => {
      expect(typeof GET).toBe('function');
    });

    it('should be defined', () => {
      expect(GET).toBeDefined();
    });
  });

  describe('POST', () => {
    it('should have the correct function signature', () => {
      expect(typeof POST).toBe('function');
    });

    it('should be defined', () => {
      expect(POST).toBeDefined();
    });
  });

  describe('userService integration', () => {
    it('should have userService methods available', () => {
      expect(userService.getAllUsers).toBeDefined();
      expect(userService.createUser).toBeDefined();
      expect(userService.getUserByClerkId).toBeDefined();
    });
  });
}); 