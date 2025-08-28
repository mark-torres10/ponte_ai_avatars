// Browser extension configuration utility for the AI Avatar extension
export interface EnvironmentConfig {
  openaiApiKey?: string;
  elevenlabsApiKey?: string;
  parkerMunnsVoiceId?: string;
}

// Default configuration values (these will be used if no stored config exists)
const DEFAULT_CONFIG: EnvironmentConfig = {
  // For testing purposes, you can add default API keys here
  // In production, these should be empty and configured by the user
  openaiApiKey: undefined,
  elevenlabsApiKey: undefined,
  parkerMunnsVoiceId: undefined
};

// Load configuration from browser extension storage
export async function loadEnvironmentConfig(): Promise<EnvironmentConfig> {
  console.log('🔍 [CONFIG] loadEnvironmentConfig() called');
  
  try {
    // Check if we're in a browser extension context
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      console.log('🔍 [CONFIG] Using chrome.storage.local');
      // Load from chrome.storage.local
      const result = await chrome.storage.local.get([
        'openaiApiKey',
        'elevenlabsApiKey',
        'parkerMunnsVoiceId'
      ]);
      
      console.log('🔍 [CONFIG] chrome.storage.local result:', result);
      
      const config = {
        openaiApiKey: result.openaiApiKey || DEFAULT_CONFIG.openaiApiKey,
        elevenlabsApiKey: result.elevenlabsApiKey || DEFAULT_CONFIG.elevenlabsApiKey,
        parkerMunnsVoiceId: result.parkerMunnsVoiceId || DEFAULT_CONFIG.parkerMunnsVoiceId
      };
      
      console.log('🔍 [CONFIG] Final config from chrome.storage:', config);
      return config;
    } else {
      // Fallback for non-extension contexts (like testing)
      console.log('🔍 [CONFIG] Not in browser extension context, using localStorage fallback');
      return loadEnvironmentConfigSync();
    }
  } catch (error) {
    console.error('❌ [CONFIG] Error loading configuration:', error);
    return { ...DEFAULT_CONFIG };
  }
}

// Save configuration to browser extension storage
export async function saveEnvironmentConfig(config: EnvironmentConfig): Promise<void> {
  console.log('💾 [CONFIG] saveEnvironmentConfig() called with:', config);
  
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      console.log('💾 [CONFIG] Saving to chrome.storage.local');
      await chrome.storage.local.set({
        openaiApiKey: config.openaiApiKey,
        elevenlabsApiKey: config.elevenlabsApiKey,
        parkerMunnsVoiceId: config.parkerMunnsVoiceId
      });
      console.log('✅ [CONFIG] Configuration saved to chrome.storage.local successfully');
    } else {
      console.log('💾 [CONFIG] Not in browser extension context, saving to localStorage');
      await saveEnvironmentConfigSync(config);
    }
  } catch (error) {
    console.error('❌ [CONFIG] Error saving configuration:', error);
  }
}

// Load configuration with fallback for testing
export function loadEnvironmentConfigSync(): EnvironmentConfig {
  console.log('🔍 [CONFIG] loadEnvironmentConfigSync() called');
  
  // For testing purposes, try to load from localStorage if available
  try {
    if (typeof localStorage !== 'undefined') {
      console.log('🔍 [CONFIG] localStorage is available');
      const stored = localStorage.getItem('ai-avatar-config');
      console.log('🔍 [CONFIG] localStorage raw value:', stored);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('🔍 [CONFIG] localStorage parsed value:', parsed);
        
        const config = {
          openaiApiKey: parsed.openaiApiKey || DEFAULT_CONFIG.openaiApiKey,
          elevenlabsApiKey: parsed.elevenlabsApiKey || DEFAULT_CONFIG.elevenlabsApiKey,
          parkerMunnsVoiceId: parsed.parkerMunnsVoiceId || DEFAULT_CONFIG.parkerMunnsVoiceId
        };
        
        console.log('🔍 [CONFIG] Final config from localStorage:', config);
        return config;
      } else {
        console.log('🔍 [CONFIG] No localStorage value found, using default config');
      }
    } else {
      console.log('🔍 [CONFIG] localStorage not available');
    }
  } catch (error) {
    console.warn('⚠️ [CONFIG] Error loading from localStorage:', error);
  }
  
  console.log('🔍 [CONFIG] Returning default config:', DEFAULT_CONFIG);
  return { ...DEFAULT_CONFIG };
}

// Save configuration to localStorage (for testing)
export async function saveEnvironmentConfigSync(config: EnvironmentConfig): Promise<void> {
  console.log('💾 [CONFIG] saveEnvironmentConfigSync() called with:', config);
  
  try {
    if (typeof localStorage !== 'undefined') {
      console.log('💾 [CONFIG] Saving to localStorage');
      localStorage.setItem('ai-avatar-config', JSON.stringify(config));
      console.log('✅ [CONFIG] Configuration saved to localStorage successfully');
      
      // Verify the save worked
      const verify = localStorage.getItem('ai-avatar-config');
      console.log('🔍 [CONFIG] Verification - localStorage after save:', verify);
    } else {
      console.warn('⚠️ [CONFIG] localStorage not available for saving');
    }
  } catch (error) {
    console.error('❌ [CONFIG] Error saving to localStorage:', error);
  }
}

// Validate API key format
export function validateOpenAIKey(apiKey: string): boolean {
  const isValid = Boolean(apiKey && apiKey.startsWith('sk-') && apiKey.length >= 20);
  console.log('🔍 [CONFIG] validateOpenAIKey() called with:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined', 'Result:', isValid);
  return isValid;
}

// Validate ElevenLabs API key format
export function validateElevenLabsKey(apiKey: string): boolean {
  const isValid = Boolean(apiKey && apiKey.startsWith('sk_') && apiKey.length >= 20);
  console.log('🔍 [CONFIG] validateElevenLabsKey() called with:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined', 'Result:', isValid);
  return isValid;
}

// Get configuration with validation (async version)
export async function getValidatedConfig(): Promise<EnvironmentConfig & { isValid: boolean; errors: string[] }> {
  console.log('🔍 [CONFIG] getValidatedConfig() called');
  
  const config = await loadEnvironmentConfig();
  console.log('🔍 [CONFIG] Loaded config for validation:', config);
  
  const errors: string[] = [];
  let isValid = true;
  
  if (!config.openaiApiKey) {
    console.log('❌ [CONFIG] OpenAI API key is missing');
    errors.push('OpenAI API key is missing');
    isValid = false;
  } else if (config.openaiApiKey && !validateOpenAIKey(config.openaiApiKey)) {
    console.log('❌ [CONFIG] OpenAI API key format is invalid');
    errors.push('OpenAI API key format is invalid');
    isValid = false;
  } else {
    console.log('✅ [CONFIG] OpenAI API key is valid');
  }
  
  if (!config.elevenlabsApiKey) {
    console.log('❌ [CONFIG] ElevenLabs API key is missing');
    errors.push('ElevenLabs API key is missing');
    isValid = false;
  } else if (config.elevenlabsApiKey && !validateElevenLabsKey(config.elevenlabsApiKey)) {
    console.log('❌ [CONFIG] ElevenLabs API key format is invalid');
    errors.push('ElevenLabs API key format is invalid');
    isValid = false;
  } else {
    console.log('✅ [CONFIG] ElevenLabs API key is valid');
  }
  
  if (!config.parkerMunnsVoiceId) {
    console.log('❌ [CONFIG] Parker Munns voice ID is missing');
    errors.push('Parker Munns voice ID is missing');
    isValid = false;
  } else {
    console.log('✅ [CONFIG] Parker Munns voice ID is present');
  }
  
  const result = {
    ...config,
    isValid,
    errors
  };
  
  console.log('🔍 [CONFIG] Validation result:', result);
  return result;
}

// Get configuration with validation (sync version for testing)
export function getValidatedConfigSync(): EnvironmentConfig & { isValid: boolean; errors: string[] } {
  console.log('🔍 [CONFIG] getValidatedConfigSync() called');
  
  const config = loadEnvironmentConfigSync();
  console.log('🔍 [CONFIG] Loaded config for sync validation:', config);
  
  const errors: string[] = [];
  let isValid = true;
  
  if (!config.openaiApiKey) {
    console.log('❌ [CONFIG] OpenAI API key is missing (sync)');
    errors.push('OpenAI API key is missing');
    isValid = false;
  } else if (config.openaiApiKey && !validateOpenAIKey(config.openaiApiKey)) {
    console.log('❌ [CONFIG] OpenAI API key format is invalid (sync)');
    errors.push('OpenAI API key format is invalid');
    isValid = false;
  } else {
    console.log('✅ [CONFIG] OpenAI API key is valid (sync)');
  }
  
  if (!config.elevenlabsApiKey) {
    console.log('❌ [CONFIG] ElevenLabs API key is missing (sync)');
    errors.push('ElevenLabs API key is missing');
    isValid = false;
  } else if (config.elevenlabsApiKey && !validateElevenLabsKey(config.elevenlabsApiKey)) {
    console.log('❌ [CONFIG] ElevenLabs API key format is invalid (sync)');
    errors.push('ElevenLabs API key format is invalid');
    isValid = false;
  } else {
    console.log('✅ [CONFIG] ElevenLabs API key is valid (sync)');
  }
  
  if (!config.parkerMunnsVoiceId) {
    console.log('❌ [CONFIG] Parker Munns voice ID is missing (sync)');
    errors.push('Parker Munns voice ID is missing');
    isValid = false;
  } else {
    console.log('✅ [CONFIG] Parker Munns voice ID is present (sync)');
  }
  
  const result = {
    ...config,
    isValid,
    errors
  };
  
  console.log('🔍 [CONFIG] Sync validation result:', result);
  return result;
}

// Log configuration status (for debugging)
export async function logConfigurationStatus(): Promise<void> {
  console.log('🔍 [CONFIG] logConfigurationStatus() called');
  const config = await getValidatedConfig();
  
  if (config.isValid) {
    console.log('✅ [CONFIG] Environment configuration loaded successfully');
    console.log('✅ [CONFIG] OpenAI API key validated');
    console.log('✅ [CONFIG] ElevenLabs API key validated');
    console.log('✅ [CONFIG] Parker Munns voice ID loaded');
  } else {
    console.warn('⚠️ [CONFIG] Environment configuration has issues:');
    config.errors.forEach(error => console.warn(`  - ${error}`));
  }
}

// Log configuration status (sync version for testing)
export function logConfigurationStatusSync(): void {
  console.log('🔍 [CONFIG] logConfigurationStatusSync() called');
  const config = getValidatedConfigSync();
  
  if (config.isValid) {
    console.log('✅ [CONFIG] Environment configuration loaded successfully (sync)');
    console.log('✅ [CONFIG] OpenAI API key validated (sync)');
    console.log('✅ [CONFIG] ElevenLabs API key validated (sync)');
    console.log('✅ [CONFIG] Parker Munns voice ID loaded (sync)');
  } else {
    console.warn('⚠️ [CONFIG] Environment configuration has issues (sync):');
    config.errors.forEach(error => console.warn(`  - ${error}`));
  }
}

// Set configuration for testing purposes
export function setTestConfiguration(config: Partial<EnvironmentConfig>): void {
  console.log('💾 [CONFIG] setTestConfiguration() called with:', config);
  
  try {
    if (typeof localStorage !== 'undefined') {
      console.log('💾 [CONFIG] localStorage is available for test config');
      const current = loadEnvironmentConfigSync();
      console.log('💾 [CONFIG] Current config before update:', current);
      
      const updated = { ...current, ...config };
      console.log('💾 [CONFIG] Updated config to save:', updated);
      
      localStorage.setItem('ai-avatar-config', JSON.stringify(updated));
      console.log('✅ [CONFIG] Test configuration saved to localStorage');
      
      // Verify the save worked
      const verify = localStorage.getItem('ai-avatar-config');
      console.log('🔍 [CONFIG] Verification - localStorage after test config save:', verify);
      
      // Test loading the config immediately
      const testLoad = loadEnvironmentConfigSync();
      console.log('🔍 [CONFIG] Test load after save:', testLoad);
      
    } else {
      console.warn('⚠️ [CONFIG] localStorage not available for test configuration');
    }
  } catch (error) {
    console.error('❌ [CONFIG] Error setting test configuration:', error);
  }
}

// Clear test configuration
export function clearTestConfiguration(): void {
  console.log('🗑️ [CONFIG] clearTestConfiguration() called');
  
  try {
    if (typeof localStorage !== 'undefined') {
      console.log('🗑️ [CONFIG] Clearing localStorage test config');
      localStorage.removeItem('ai-avatar-config');
      console.log('✅ [CONFIG] Test configuration cleared from localStorage');
      
      // Verify the clear worked
      const verify = localStorage.getItem('ai-avatar-config');
      console.log('🔍 [CONFIG] Verification - localStorage after clear:', verify);
      
    } else {
      console.warn('⚠️ [CONFIG] localStorage not available for clearing test config');
    }
  } catch (error) {
    console.error('❌ [CONFIG] Error clearing test configuration:', error);
  }
}
