// API Keys Configuration Template for AI Avatar Extension
// Copy this file to keys.ts and fill in your actual API keys
// DO NOT commit keys.ts to version control - it contains sensitive data!

export const API_KEYS = {
  // OpenAI API Key for AI commentary generation
  // Get your key from: https://platform.openai.com/api-keys
  OPENAI_API_KEY: 'your-openai-api-key-here',
  
  // ElevenLabs API Key for voice synthesis
  // Get your key from: https://elevenlabs.io/
  ELEVENLABS_API_KEY: 'your-elevenlabs-api-key-here',
  
  // ElevenLabs Voice ID for Parker Munns
  // This is a specific voice ID from ElevenLabs
  ELEVENLABS_PARKER_MUNNS_VOICE_ID: 'your-parker-munns-voice-id-here'
};

// Development flag to indicate if we're using hardcoded keys
export const IS_DEVELOPMENT = true;

// IMPORTANT SECURITY NOTES:
// 1. NEVER commit keys.ts to version control
// 2. NEVER share your API keys publicly
// 3. In production, use secure configuration management
// 4. Consider using environment variables or secure storage
// 5. Rotate your API keys regularly
