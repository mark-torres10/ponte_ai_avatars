// Environment configuration utility for the AI Avatar extension
export interface EnvironmentConfig {
  openaiApiKey?: string;
  elevenlabsApiKey?: string;
  parkerMunnsVoiceId?: string;
}

// Load environment configuration
export function loadEnvironmentConfig(): EnvironmentConfig {
  // In a browser extension context, we need to access environment variables differently
  // For now, we'll use a simple approach that can be enhanced later
  
  const config: EnvironmentConfig = {};
  
  // Try to get OpenAI API key from various sources
  if (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY) {
    config.openaiApiKey = process.env.OPENAI_API_KEY;
  }
  
  // Try to get ElevenLabs API key
  if (typeof process !== 'undefined' && process.env?.ELEVENLABS_API_KEY) {
    config.elevenlabsApiKey = process.env.ELEVENLABS_API_KEY;
  }
  
  // Try to get Parker Munns voice ID
  if (typeof process !== 'undefined' && process.env?.ELEVENLABS_PARKER_MUNNS_VOICE_ID) {
    config.parkerMunnsVoiceId = process.env.ELEVENLABS_PARKER_MUNNS_VOICE_ID;
  }
  
  return config;
}

// Validate API key format
export function validateOpenAIKey(apiKey: string): boolean {
  // OpenAI API keys typically start with 'sk-' and are 51 characters long
  return Boolean(apiKey && apiKey.startsWith('sk-') && apiKey.length >= 20);
}

// Validate ElevenLabs API key format
export function validateElevenLabsKey(apiKey: string): boolean {
  // ElevenLabs API keys typically start with 'sk_' and are 32+ characters long
  return Boolean(apiKey && apiKey.startsWith('sk_') && apiKey.length >= 20);
}

// Get configuration with validation
export function getValidatedConfig(): EnvironmentConfig & { isValid: boolean; errors: string[] } {
  const config = loadEnvironmentConfig();
  const errors: string[] = [];
  let isValid = true;
  
  if (!config.openaiApiKey) {
    errors.push('OpenAI API key is missing');
    isValid = false;
  } else if (config.openaiApiKey && !validateOpenAIKey(config.openaiApiKey)) {
    errors.push('OpenAI API key format is invalid');
    isValid = false;
  }
  
  if (!config.elevenlabsApiKey) {
    errors.push('ElevenLabs API key is missing');
    isValid = false;
  } else if (config.elevenlabsApiKey && !validateElevenLabsKey(config.elevenlabsApiKey)) {
    errors.push('ElevenLabs API key format is invalid');
    isValid = false;
  }
  
  if (!config.parkerMunnsVoiceId) {
    errors.push('Parker Munns voice ID is missing');
    isValid = false;
  }
  
  return {
    ...config,
    isValid,
    errors
  };
}

// Log configuration status (for debugging)
export function logConfigurationStatus(): void {
  const config = getValidatedConfig();
  
  if (config.isValid) {
    console.log('✅ Environment configuration loaded successfully');
    console.log('✅ OpenAI API key validated');
    console.log('✅ ElevenLabs API key validated');
    console.log('✅ Parker Munns voice ID loaded');
  } else {
    console.warn('⚠️ Environment configuration has issues:');
    config.errors.forEach(error => console.warn(`  - ${error}`));
  }
}
