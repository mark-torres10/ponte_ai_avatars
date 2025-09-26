import * as yaml from 'js-yaml';

export interface VoiceConfig {
  openai_voice: string;
  display_name: string;
  description: string;
  personality: string;
  tone: string;
  energy: string;
  style: string;
}

export interface DifficultyConfig {
  description: string;
  instructions: string;
}

export interface SportsContextConfig {
  terminology: string[];
  personality: string;
  focus: string;
}

export interface VoicePersonalitiesConfig {
  voices: Record<string, VoiceConfig>;
  difficulty_levels: Record<string, DifficultyConfig>;
  sports_contexts: Record<string, SportsContextConfig>;
}

class YAMLConfigLoader {
  private configCache: VoicePersonalitiesConfig | null = null;

  async loadConfig(): Promise<VoicePersonalitiesConfig> {
    if (this.configCache) {
      return this.configCache;
    }

    try {
      // In a browser extension, we need to fetch the YAML file
      // For now, we'll use a fallback approach since we can't directly access the shared config
      // In production, you might want to serve this via your backend API
      const response = await fetch('/shared_config/voice_personalities.yaml');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status}`);
      }
      
      const yamlText = await response.text();
      const config = yaml.load(yamlText) as VoicePersonalitiesConfig;
      
      this.configCache = config;
      return config;
    } catch (error) {
      console.warn('Failed to load YAML config, using fallback:', error);
      return this.getFallbackConfig();
    }
  }

  private getFallbackConfig(): VoicePersonalitiesConfig {
    return {
      voices: {
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
      },
      difficulty_levels: {
        easy: {
          description: "Encouraging, supportive, educational approach",
          instructions: "You are Parker, an encouraging and supportive sports commentator..."
        },
        savage: {
          description: "Competitive, intense, challenging approach", 
          instructions: "You are Parker, a brutally honest and no-nonsense sports commentator..."
        },
        expert: {
          description: "Technical, analytical, detailed approach",
          instructions: "You are Parker, a technical and analytical sports commentator..."
        }
      },
      sports_contexts: {
        basketball: {
          terminology: ["dribble", "shooting percentage", "rebound", "assist", "steal", "block"],
          personality: "fast-paced and energetic",
          focus: "offensive and defensive strategies"
        },
        football: {
          terminology: ["touchdown", "interception", "sack", "field goal", "punt", "fumble"],
          personality: "strategic and analytical",
          focus: "play calling and execution"
        },
        soccer: {
          terminology: ["goal", "assist", "tackle", "corner kick", "penalty", "offside"],
          personality: "passionate and tactical",
          focus: "team coordination and individual skill"
        },
        baseball: {
          terminology: ["home run", "strikeout", "walk", "steal", "double play", "sacrifice"],
          personality: "methodical and statistical",
          focus: "pitching and batting strategies"
        },
        hockey: {
          terminology: ["goal", "assist", "power play", "penalty kill", "faceoff", "check"],
          personality: "intense and fast-paced",
          focus: "speed and physical play"
        }
      }
    };
  }

  async getVoices(): Promise<Record<string, VoiceConfig>> {
    const config = await this.loadConfig();
    return config.voices;
  }

  async getDifficultyLevels(): Promise<Record<string, DifficultyConfig>> {
    const config = await this.loadConfig();
    return config.difficulty_levels;
  }

  async getSportsContexts(): Promise<Record<string, SportsContextConfig>> {
    const config = await this.loadConfig();
    return config.sports_contexts;
  }

  clearCache(): void {
    this.configCache = null;
  }
}

// Export singleton instance
export const yamlLoader = new YAMLConfigLoader();
