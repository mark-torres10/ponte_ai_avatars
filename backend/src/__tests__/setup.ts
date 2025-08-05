// Test environment setup
process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '3002';
process.env['CORS_ORIGIN'] = 'http://localhost:3000';
process.env['LOG_LEVEL'] = 'error'; // Reduce log noise during tests

// API Keys for tests
process.env['OPENAI_API_KEY'] = 'test-openai-key';
process.env['ELEVENLABS_API_KEY'] = 'test-elevenlabs-key';
process.env['DID_API_KEY'] = 'test-did-key';
process.env['ELEVENLABS_TERRY_CREWS_VOICE_ID'] = 'test-terry-crews-voice-id';
process.env['ELEVENLABS_WILL_HOWARD_VOICE_ID'] = 'test-will-howard-voice-id';

// Supabase configuration for tests
process.env['SUPABASE_URL'] = 'https://test.supabase.co';
process.env['SUPABASE_ANON_KEY'] = 'test-anon-key';
process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-service-role-key';

// Storage configuration for tests
process.env['STORAGE_BUCKET'] = 'test-bucket-ponteai';
process.env['DEFAULT_REQUESTER_ID'] = 'test_user_id';

// Global test timeout
jest.setTimeout(10000);

// Suppress console output during tests unless there's an error
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.info = originalConsoleInfo;
  console.warn = originalConsoleWarn;
}); 