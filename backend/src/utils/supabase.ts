import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';
import { logger } from './logger';

// Supabase client instance
let supabaseClient: SupabaseClient | null = null;

/**
 * Initialize and validate Supabase client
 * @returns Supabase client instance
 * @throws Error if Supabase configuration is invalid
 */
export const initializeSupabase = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient;
  }

  // Validate Supabase configuration
  if (!config.SUPABASE_URL) {
    throw new Error('SUPABASE_URL environment variable is required');
  }

  if (!config.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY environment variable is required');
  }

  // Create Supabase client
  supabaseClient = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  logger.info('Supabase client initialized successfully');
  return supabaseClient;
};

/**
 * Get Supabase client instance
 * @returns Supabase client instance
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    return initializeSupabase();
  }
  return supabaseClient;
};

/**
 * Test Supabase connection
 * @returns Promise<boolean> - true if connection is successful
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const client = getSupabaseClient();
    
    // Test connection by attempting to list buckets
    const { data, error } = await client.storage.listBuckets();
    
    if (error) {
      logger.error('Supabase connection test failed', { error: error.message });
      return false;
    }

    logger.info('Supabase connection test successful', { 
      bucketCount: data?.length || 0 
    });
    return true;
  } catch (error) {
    logger.error('Supabase connection test failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return false;
  }
};

/**
 * Validate bucket exists and is accessible
 * @param bucketName - Name of the bucket to validate
 * @returns Promise<boolean> - true if bucket exists and is accessible
 */
export const validateBucket = async (bucketName: string): Promise<boolean> => {
  try {
    const client = getSupabaseClient();
    
    const { data, error } = await client.storage.getBucket(bucketName);
    
    if (error) {
      logger.error('Bucket validation failed', { 
        bucketName, 
        error: error.message 
      });
      return false;
    }

    logger.info('Bucket validation successful', { 
      bucketName, 
      public: data.public 
    });
    return true;
  } catch (error) {
    logger.error('Bucket validation failed', { 
      bucketName, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return false;
  }
}; 