import { VoiceType } from '../types';
import { yamlLoader, VoiceConfig } from '../utils/yamlLoader';

// Cache for voice configurations
let voiceConfigurations: Record<VoiceType, VoiceConfig> | null = null;

// Initialize voice configurations from YAML
const initializeVoiceConfigs = async (): Promise<Record<VoiceType, VoiceConfig>> => {
  if (voiceConfigurations) {
    return voiceConfigurations;
  }

  try {
    const voices = await yamlLoader.getVoices();
    voiceConfigurations = {
      verse: voices.verse,
      cedar: voices.cedar,
      marin: voices.marin
    };
    return voiceConfigurations;
  } catch (error) {
    console.warn('Failed to load voice configs from YAML, using fallback:', error);
    // Fallback configuration
    voiceConfigurations = {
      verse: {
        openai_voice: "verse",
        display_name: "Don Jones",
        description: "The balanced veteran - warm, conversational, and always approachable",
        personality: "Like your favorite local sports radio host who makes everyone feel welcome",
        tone: "approachable and encouraging",
        energy: "moderate",
        style: "conversational"
      },
      cedar: {
        openai_voice: "cedar",
        display_name: "Mike Smith",
        description: "The authoritative analyst - deep, professional, and commanding respect",
        personality: "Think legendary coach breaking down plays with decades of wisdom",
        tone: "confident and knowledgeable",
        energy: "calm",
        style: "professional"
      },
      marin: {
        openai_voice: "marin",
        display_name: "Rocket Jones",
        description: "The high-energy play-by-play - enthusiastic, dynamic, and electrifying",
        personality: "Pure energy and excitement - like the best play-by-play announcer at peak moments",
        tone: "exciting and passionate",
        energy: "high",
        style: "dynamic"
      }
    };
    return voiceConfigurations;
  }
};

export const getVoiceConfig = async (voiceType: VoiceType): Promise<VoiceConfig> => {
  const configs = await initializeVoiceConfigs();
  return configs[voiceType];
};

export const getVoiceName = async (voiceType: VoiceType): Promise<string> => {
  const config = await getVoiceConfig(voiceType);
  return config.display_name;
};

export const getVoiceDescription = async (voiceType: VoiceType): Promise<string> => {
  const config = await getVoiceConfig(voiceType);
  return config.description;
};

export const getVoicePersonality = async (voiceType: VoiceType): Promise<string> => {
  const config = await getVoiceConfig(voiceType);
  return config.personality;
};

// Synchronous versions for backward compatibility (using cached data)
export const getVoiceConfigSync = (voiceType: VoiceType): VoiceConfig => {
  if (!voiceConfigurations) {
    throw new Error('Voice configurations not initialized. Call initializeVoiceConfigs() first.');
  }
  return voiceConfigurations[voiceType];
};

export const getVoiceNameSync = (voiceType: VoiceType): string => {
  return getVoiceConfigSync(voiceType).display_name;
};

export const getVoiceDescriptionSync = (voiceType: VoiceType): string => {
  return getVoiceConfigSync(voiceType).description;
};

export const getVoicePersonalitySync = (voiceType: VoiceType): string => {
  return getVoiceConfigSync(voiceType).personality;
};
