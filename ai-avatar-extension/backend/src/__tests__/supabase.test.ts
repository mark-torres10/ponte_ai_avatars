import { createClient } from '@supabase/supabase-js';
import { initializeSupabase, getSupabaseClient, testSupabaseConnection, validateBucket } from '../utils/supabase';

// Mock Supabase client
jest.mock('@supabase/supabase-js');
jest.mock('../utils/config', () => ({
  config: {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
  },
}));
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('Supabase Utils', () => {
  const mockSupabaseClient = {
    storage: {
      listBuckets: jest.fn(),
      getBucket: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockReturnValue(mockSupabaseClient as unknown as ReturnType<typeof import('@supabase/supabase-js').createClient>);
    // Reset the module to clear the singleton client
    jest.resetModules();
  });

  describe('initializeSupabase', () => {
    it('should initialize Supabase client with valid config', () => {
      const client = initializeSupabase();

      expect(mockCreateClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-service-key',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
      expect(client).toBe(mockSupabaseClient);
    });

    it('should return existing client if already initialized', () => {
      const client1 = initializeSupabase();
      const client2 = initializeSupabase();

      expect(client1).toBe(client2);
    });
  });

  describe('getSupabaseClient', () => {
    it('should return existing client if initialized', () => {
      initializeSupabase();
      const client = getSupabaseClient();

      expect(client).toBe(mockSupabaseClient);
    });

    it('should initialize client if not already initialized', () => {
      const client = getSupabaseClient();

      expect(client).toBe(mockSupabaseClient);
    });
  });

  describe('testSupabaseConnection', () => {

    it('should return true for successful connection', async () => {
      mockSupabaseClient.storage.listBuckets.mockResolvedValue({
        data: [{ name: 'bucket1' }, { name: 'bucket2' }],
        error: null,
      });

      const result = await testSupabaseConnection();

      expect(result).toBe(true);
      expect(mockSupabaseClient.storage.listBuckets).toHaveBeenCalled();
    });

    it('should return false for connection error', async () => {
      mockSupabaseClient.storage.listBuckets.mockResolvedValue({
        data: null,
        error: { message: 'Connection failed' },
      });

      const result = await testSupabaseConnection();

      expect(result).toBe(false);
    });

    it('should return false for exception', async () => {
      mockSupabaseClient.storage.listBuckets.mockRejectedValue(new Error('Network error'));

      const result = await testSupabaseConnection();

      expect(result).toBe(false);
    });
  });

  describe('validateBucket', () => {

    it('should return true for valid bucket', async () => {
      mockSupabaseClient.storage.getBucket.mockResolvedValue({
        data: { name: 'test-bucket', public: false },
        error: null,
      });

      const result = await validateBucket('test-bucket');

      expect(result).toBe(true);
      expect(mockSupabaseClient.storage.getBucket).toHaveBeenCalledWith('test-bucket');
    });

    it('should return false for invalid bucket', async () => {
      mockSupabaseClient.storage.getBucket.mockResolvedValue({
        data: null,
        error: { message: 'Bucket not found' },
      });

      const result = await validateBucket('invalid-bucket');

      expect(result).toBe(false);
    });

    it('should return false for exception', async () => {
      mockSupabaseClient.storage.getBucket.mockRejectedValue(new Error('Network error'));

      const result = await validateBucket('test-bucket');

      expect(result).toBe(false);
    });
  });
}); 