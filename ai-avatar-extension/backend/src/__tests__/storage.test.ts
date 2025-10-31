import { uploadAudioFile, generateFilePath, generateTimestamp, getNextVersion, getPublicUrl, listFiles } from '../services/storage';
import { getSupabaseClient, validateBucket } from '../utils/supabase';

// Mock Supabase client
jest.mock('../utils/supabase');

const mockSupabaseClient = {
  storage: {
    from: jest.fn().mockReturnThis(),
    upload: jest.fn(),
    list: jest.fn(),
    getPublicUrl: jest.fn(),
  },
};

const mockGetSupabaseClient = getSupabaseClient as jest.MockedFunction<typeof getSupabaseClient>;
const mockValidateBucket = validateBucket as jest.MockedFunction<typeof validateBucket>;

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSupabaseClient.mockReturnValue(mockSupabaseClient as unknown as ReturnType<typeof import('@supabase/supabase-js').createClient>);
  });

  describe('generateFilePath', () => {
    it('should generate correct file path', () => {
      const path = generateFilePath('test_user', 'voice_actor_a', '2024-01-15_14-30-25', 'audio_v1.mp3');
      expect(path).toBe('test_user/voice_actor_a/2024-01-15_14-30-25/audio_v1.mp3');
    });
  });

  describe('generateTimestamp', () => {
    it('should generate timestamp in correct format', () => {
      const timestamp = generateTimestamp();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/);
    });
  });

  describe('getNextVersion', () => {
    it('should return version 1 for new files', async () => {
      mockSupabaseClient.storage.list.mockResolvedValue({
        data: [],
        error: null,
      });

      const version = await getNextVersion('test_user', 'voice_actor_a', '2024-01-15_14-30-25', 'audio');
      expect(version).toBe(1);
    });

    it('should return next version for existing files', async () => {
      mockSupabaseClient.storage.list.mockResolvedValue({
        data: [
          { name: 'audio_v1.mp3' },
          { name: 'audio_v2.mp3' },
          { name: 'metadata.json' },
        ],
        error: null,
      });

      const version = await getNextVersion('test_user', 'voice_actor_a', '2024-01-15_14-30-25', 'audio');
      expect(version).toBe(3);
    });

    it('should handle listing errors gracefully', async () => {
      mockSupabaseClient.storage.list.mockResolvedValue({
        data: null,
        error: { message: 'List failed' },
      });

      const version = await getNextVersion('test_user', 'voice_actor_a', '2024-01-15_14-30-25', 'audio');
      expect(version).toBe(1);
    });
  });

  describe('uploadAudioFile', () => {
    const mockAudioBuffer = new ArrayBuffer(1024);
    const mockOptions = {
      voiceActorId: 'voice_actor_a',
      audioBuffer: mockAudioBuffer,
      text: 'Test audio content',
      format: 'mp3' as const,
    };

    beforeEach(() => {
      mockValidateBucket.mockResolvedValue(true);
      mockSupabaseClient.storage.list.mockResolvedValue({
        data: [],
        error: null,
      });
    });

    it('should upload audio file successfully', async () => {
      mockSupabaseClient.storage.upload
        .mockResolvedValueOnce({ error: null }) // Audio upload
        .mockResolvedValueOnce({ error: null }) // Metadata upload
        .mockResolvedValueOnce({ error: null }); // Text upload

      const result = await uploadAudioFile(mockOptions);

      expect(result.success).toBe(true);
      expect(result.fileKey).toMatch(/test_user_id\/voice_actor_a\/\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\/audio_v1\.mp3/);
      expect(result.version).toBe(1);
    });

    it('should handle bucket validation failure', async () => {
      mockValidateBucket.mockResolvedValue(false);

      const result = await uploadAudioFile(mockOptions);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Storage bucket not accessible');
    });

    it('should handle audio upload failure', async () => {
      mockSupabaseClient.storage.upload.mockResolvedValueOnce({
        error: { message: 'Upload failed' },
      });

      const result = await uploadAudioFile(mockOptions);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to upload audio file');
    });

    it('should continue on metadata upload failure', async () => {
      mockSupabaseClient.storage.upload
        .mockResolvedValueOnce({ error: null }) // Audio upload
        .mockResolvedValueOnce({ error: { message: 'Metadata upload failed' } }) // Metadata upload
        .mockResolvedValueOnce({ error: null }); // Text upload

      const result = await uploadAudioFile(mockOptions);

      expect(result.success).toBe(true);
      expect(result.fileKey).toBeDefined();
    });

    it('should continue on text upload failure', async () => {
      mockSupabaseClient.storage.upload
        .mockResolvedValueOnce({ error: null }) // Audio upload
        .mockResolvedValueOnce({ error: null }) // Metadata upload
        .mockResolvedValueOnce({ error: { message: 'Text upload failed' } }); // Text upload

      const result = await uploadAudioFile(mockOptions);

      expect(result.success).toBe(true);
      expect(result.fileKey).toBeDefined();
    });
  });

  describe('getPublicUrl', () => {
    it('should return public URL', () => {
      const mockPublicUrl = 'https://example.com/file.mp3';
      mockSupabaseClient.storage.getPublicUrl.mockReturnValue({
        data: { publicUrl: mockPublicUrl },
      });

      const url = getPublicUrl('test/path/file.mp3');
      expect(url).toBe(mockPublicUrl);
    });
  });

  describe('listFiles', () => {
    it('should list files in directory', async () => {
      const mockFiles = [
        { name: 'audio_v1.mp3' },
        { name: 'metadata.json' },
      ];
      mockSupabaseClient.storage.list.mockResolvedValue({
        data: mockFiles,
        error: null,
      });

      const files = await listFiles('test_user', 'voice_actor_a', '2024-01-15_14-30-25');

      expect(files).toEqual([
        'test_user/voice_actor_a/2024-01-15_14-30-25/audio_v1.mp3',
        'test_user/voice_actor_a/2024-01-15_14-30-25/metadata.json',
      ]);
    });

    it('should handle listing errors', async () => {
      mockSupabaseClient.storage.list.mockResolvedValue({
        data: null,
        error: { message: 'List failed' },
      });

      const files = await listFiles('test_user', 'voice_actor_a');

      expect(files).toEqual([]);
    });
  });
}); 