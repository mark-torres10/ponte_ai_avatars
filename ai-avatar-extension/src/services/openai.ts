import OpenAI from 'openai';
import { getValidatedConfig, setTestConfiguration, clearTestConfiguration } from '../utils/config';

// Types for commentary generation
export interface GameData {
  teamNames?: string[];
  scores?: {
    home: number;
    away: number;
  };
  venue?: string;
  gameStatus?: string;
  gameTime?: {
    quarter: string;
    timeRemaining: string;
  };
  location?: string;
  metadata?: {
    date?: string;
    attendance?: string;
    season?: string;
    playoffs?: boolean;
  };
  // Enhanced game context
  context?: {
    rivalry?: boolean;
    playoffImplications?: boolean;
    seasonSeries?: string;
    keyPlayers?: string[];
    recentForm?: string[];
  };
}

export interface CommentaryResult {
  success: boolean;
  commentary?: string;
  error?: string;
  fallbackContent?: string;
  retryAfter?: number;
  source: 'openai' | 'fallback';
  metadata?: {
    promptLength: number;
    gameContext: string;
    generationTime: number;
  };
}

export interface FallbackContent {
  content: string;
  source: string;
}

// Enhanced commentary styles for different scenarios
export type CommentaryStyle = 
  | 'play-by-play'
  | 'analytical'
  | 'color-commentary'
  | 'post-game'
  | 'pre-game'
  | 'halftime';

// OpenAI service class
export class OpenAIService {
  private client: OpenAI | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    console.log('🔧 [OPENAI] initialize() called');
    
    try {
      console.log('🔧 [OPENAI] Getting validated config...');
      const config = await getValidatedConfig();
      console.log('🔧 [OPENAI] Config received:', config);

      if (!config.isValid) {
        console.warn('⚠️ [OPENAI] OpenAI service initialization failed:', config.errors);
        return;
      }

      if (!config.openaiApiKey) {
        console.warn('⚠️ [OPENAI] OpenAI API key not available');
        return;
      }

      console.log('🔧 [OPENAI] Creating OpenAI client with API key...');
      this.client = new OpenAI({
        apiKey: config.openaiApiKey,
        dangerouslyAllowBrowser: true // Note: This is for demo purposes only
      });

      this.isInitialized = true;
      console.log('✅ [OPENAI] OpenAI service initialized successfully');
    } catch (error) {
      console.error('❌ [OPENAI] Error initializing OpenAI service:', error);
    }
  }

  // Set test configuration for testing purposes
  async setTestConfig(apiKey: string): Promise<void> {
    console.log('🔧 [OPENAI] setTestConfig() called with API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
    
    try {
      console.log('🔧 [OPENAI] Setting test configuration...');
      await setTestConfiguration({ openaiApiKey: apiKey });
      console.log('✅ [OPENAI] Test configuration set successfully');
      
      // Reinitialize with new config
      console.log('🔧 [OPENAI] Reinitializing service with new config...');
      this.isInitialized = false;
      this.client = null;
      
      console.log('🔧 [OPENAI] Calling initialize()...');
      await this.initialize();
      console.log('🔧 [OPENAI] Initialize() completed. Service ready:', this.isReady());
      
    } catch (error) {
      console.error('❌ [OPENAI] Error in setTestConfig:', error);
    }
  }

  // Clear test configuration
  async clearTestConfig(): Promise<void> {
    await clearTestConfiguration();
    this.isInitialized = false;
    this.client = null;
  }

  // Generate sports commentary from game data with enhanced logic
  async generateSportsCommentary(
    gameData: GameData, 
    style: CommentaryStyle = 'post-game'
  ): Promise<CommentaryResult> {
    const startTime = Date.now();
    
    try {
      if (!this.isInitialized || !this.client) {
        console.warn('⚠️ OpenAI service not initialized, using fallback');
        return this.generateFallbackCommentary(gameData, style);
      }

      const prompt = this.buildEnhancedCommentaryPrompt(gameData, style);
      console.log('📝 Generated enhanced commentary prompt:', prompt);

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(style)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.8,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const commentary = response.choices[0]?.message?.content;

      if (commentary) {
        const generationTime = Date.now() - startTime;
        console.log('✅ Enhanced commentary generated successfully');
        
        return {
          success: true,
          commentary: commentary.trim(),
          source: 'openai',
          metadata: {
            promptLength: prompt.length,
            gameContext: this.getGameContextSummary(gameData),
            generationTime
          }
        };
      } else {
        console.warn('⚠️ No commentary generated from OpenAI, using fallback');
        return this.generateFallbackCommentary(gameData, style);
      }

    } catch (error: any) {
      console.error('❌ Error generating enhanced commentary:', error);

      // Handle specific error types with enhanced fallback
      if (error?.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
          retryAfter: 60,
          fallbackContent: this.generateFallbackCommentary(gameData, style).fallbackContent,
          source: 'fallback'
        };
      }

      if (error?.status === 401) {
        return {
          success: false,
          error: 'Invalid API key. Please check your OpenAI configuration.',
          fallbackContent: this.generateFallbackCommentary(gameData, style).fallbackContent,
          source: 'fallback'
        };
      }

      if (error?.message?.includes('timeout')) {
        return {
          success: false,
          error: 'Request timeout. Please try again.',
          fallbackContent: this.generateFallbackCommentary(gameData, style).fallbackContent,
          source: 'fallback'
        };
      }

      // Generic error handling with enhanced fallback
      return {
        success: false,
        error: 'Unable to generate commentary at this time.',
        fallbackContent: this.generateFallbackCommentary(gameData, style).fallbackContent,
        source: 'fallback'
      };
    }
  }

  // Enhanced system prompt based on commentary style
  private getSystemPrompt(style: CommentaryStyle): string {
    const basePrompt = 'You are an expert sports commentator specializing in NBA basketball.';
    
    const stylePrompts = {
      'play-by-play': `${basePrompt} Provide exciting, real-time style commentary that captures the energy and drama of the moment. Use present tense and create urgency.`,
      'analytical': `${basePrompt} Provide insightful analysis of the game, focusing on strategy, statistics, and key turning points. Be objective and data-driven.`,
      'color-commentary': `${basePrompt} Provide entertaining, personality-driven commentary with anecdotes, humor, and engaging storytelling. Be charismatic and relatable.`,
      'post-game': `${basePrompt} Provide comprehensive post-game analysis that summarizes the key moments, highlights, and implications. Be reflective and forward-looking.`,
      'pre-game': `${basePrompt} Provide engaging pre-game analysis that sets the stage for the matchup, discusses storylines, and builds anticipation.`,
      'halftime': `${basePrompt} Provide halftime analysis that recaps the first half and previews what to expect in the second half.`
    };

    return stylePrompts[style] || stylePrompts['post-game'];
  }

  // Enhanced prompt building with context awareness
  private buildEnhancedCommentaryPrompt(gameData: GameData, style: CommentaryStyle): string {
    let prompt = `Generate ${style} commentary for this NBA game:\n\n`;

    // Add team information with enhanced context
    if (gameData.teamNames && gameData.teamNames.length >= 2) {
      prompt += `**Teams**: ${gameData.teamNames.join(' vs ')}\n`;
      
      // Add rivalry context if available
      if (gameData.context?.rivalry) {
        prompt += `**Rivalry**: This is a historic rivalry matchup with intense competition.\n`;
      }
    }

    // Add score information with context
    if (gameData.scores) {
      const { home, away } = gameData.scores;
      const margin = Math.abs(home - away);
      const isClose = margin <= 5;
      const isBlowout = margin >= 20;
      
      prompt += `**Score**: ${away}-${home}\n`;
      
      if (isClose) {
        prompt += `**Game Type**: This was a nail-biter with ${margin} point difference.\n`;
      } else if (isBlowout) {
        prompt += `**Game Type**: This was a dominant performance with ${margin} point margin.\n`;
      } else {
        prompt += `**Game Type**: Competitive game with ${margin} point difference.\n`;
      }
    }

    // Add venue information with atmosphere context
    if (gameData.venue) {
      prompt += `**Venue**: ${gameData.venue}\n`;
      
      // Add venue-specific context
      if (gameData.venue.includes('Arena') || gameData.venue.includes('Center')) {
        prompt += `**Atmosphere**: Professional arena setting with passionate fans.\n`;
      }
    }

    // Add game status with time context
    if (gameData.gameStatus) {
      prompt += `**Game Status**: ${gameData.gameStatus}\n`;
      
      if (gameData.gameStatus === 'Final') {
        prompt += `**Context**: Game completed - provide post-game analysis.\n`;
      } else if (gameData.gameStatus.includes('Q')) {
        prompt += `**Context**: Live game in progress - provide current analysis.\n`;
      } else if (gameData.gameStatus === 'Halftime') {
        prompt += `**Context**: Halftime break - provide first half recap and second half preview.\n`;
      }
    }

    // Add game time information
    if (gameData.gameTime) {
      prompt += `**Game Time**: ${gameData.gameTime.quarter} ${gameData.gameTime.timeRemaining}\n`;
    }

    // Add location context
    if (gameData.location) {
      prompt += `**Location**: ${gameData.location}\n`;
      
      // Add regional context
      if (gameData.location.includes('CA')) {
        prompt += `**Regional Context**: California basketball with West Coast style.\n`;
      } else if (gameData.location.includes('NY')) {
        prompt += `**Regional Context**: New York basketball with East Coast intensity.\n`;
      }
    }

    // Add enhanced metadata
    if (gameData.metadata) {
      if (gameData.metadata.date) {
        prompt += `**Date**: ${gameData.metadata.date}\n`;
      }
      
      if (gameData.metadata.attendance) {
        prompt += `**Attendance**: ${gameData.metadata.attendance}\n`;
      }
      
      if (gameData.metadata.playoffs) {
        prompt += `**Playoff Context**: This is a playoff game with high stakes.\n`;
      }
      
      if (gameData.metadata.season) {
        prompt += `**Season**: ${gameData.metadata.season}\n`;
      }
    }

    // Add context-specific information
    if (gameData.context) {
      if (gameData.context.playoffImplications) {
        prompt += `**Playoff Implications**: This game has significant playoff implications.\n`;
      }
      
      if (gameData.context.seasonSeries) {
        prompt += `**Season Series**: ${gameData.context.seasonSeries}\n`;
      }
      
      if (gameData.context.keyPlayers && gameData.context.keyPlayers.length > 0) {
        prompt += `**Key Players**: ${gameData.context.keyPlayers.join(', ')}\n`;
      }
      
      if (gameData.context.recentForm && gameData.context.recentForm.length > 0) {
        prompt += `**Recent Form**: ${gameData.context.recentForm.join(', ')}\n`;
      }
    }

    // Add style-specific instructions
    const styleInstructions = {
      'play-by-play': '\n**Instructions**: Create exciting, real-time commentary that makes the reader feel like they are watching the game live. Use action verbs and create urgency.',
      'analytical': '\n**Instructions**: Provide deep analysis focusing on strategy, statistics, and key turning points. Be objective and insightful.',
      'color-commentary': '\n**Instructions**: Be entertaining and personality-driven. Include anecdotes, humor, and engaging storytelling while maintaining sports expertise.',
      'post-game': '\n**Instructions**: Provide comprehensive analysis that summarizes the game, highlights key moments, and discusses implications for both teams.',
      'pre-game': '\n**Instructions**: Build anticipation by discussing storylines, key matchups, and what to expect. Set the stage for an exciting game.',
      'halftime': '\n**Instructions**: Recap the first half highlights and preview what to expect in the second half. Provide strategic insights.'
    };

    prompt += styleInstructions[style] || styleInstructions['post-game'];
    
    prompt += '\n\nPlease provide engaging, contextually relevant commentary that captures the essence of this matchup.';

    return prompt;
  }

  // Generate fallback commentary when OpenAI is unavailable
  private generateFallbackCommentary(gameData: GameData, style: CommentaryStyle): CommentaryResult {
    const fallbackContent = this.getEnhancedFallbackContent(gameData, style);

    return {
      success: false,
      fallbackContent: fallbackContent.content,
      error: 'Using fallback content due to service unavailability',
      source: 'fallback'
    };
  }

  // Enhanced fallback content based on style and context
  private getEnhancedFallbackContent(gameData: GameData, style: CommentaryStyle): FallbackContent {
    let content = '';

    // Style-specific fallback content
    switch (style) {
      case 'play-by-play':
        content = this.generatePlayByPlayFallback(gameData);
        break;
      case 'analytical':
        content = this.generateAnalyticalFallback(gameData);
        break;
      case 'color-commentary':
        content = this.generateColorCommentaryFallback(gameData);
        break;
      case 'pre-game':
        content = this.generatePreGameFallback(gameData);
        break;
      case 'halftime':
        content = this.generateHalftimeFallback(gameData);
        break;
      default: // post-game
        content = this.generatePostGameFallback(gameData);
    }

    return {
      content,
      source: `fallback-${style}`
    };
  }

  // Generate play-by-play style fallback
  private generatePlayByPlayFallback(gameData: GameData): string {
    const teamNames = gameData.teamNames || ['Team A', 'Team B'];
    const scores = gameData.scores;
    
    if (scores) {
      return `What an incredible sequence of events in this ${teamNames.join(' vs ')} matchup! The intensity is palpable as both teams battle for every possession. The crowd is electric, and you can feel the energy building with each play. This is NBA basketball at its finest!`;
    }
    
    return `The ${teamNames.join(' vs ')} game is heating up! Every possession matters, every shot counts, and the atmosphere is absolutely electric. This is what basketball is all about!`;
  }

  // Generate analytical style fallback
  private generateAnalyticalFallback(gameData: GameData): string {
    const teamNames = gameData.teamNames || ['Team A', 'Team B'];
    const scores = gameData.scores;
    
    if (scores) {
      const margin = Math.abs(scores.home - scores.away);
      return `Analyzing this ${teamNames.join(' vs ')} contest, the key factors were defensive intensity and execution in critical moments. The ${margin}-point margin reflects the strategic battle that unfolded throughout the game.`;
    }
    
    return `From a strategic perspective, this ${teamNames.join(' vs ')} matchup presents fascinating tactical considerations. Both teams bring unique strengths that will create an intriguing chess match on the court.`;
  }

  // Generate color commentary style fallback
  private generateColorCommentaryFallback(gameData: GameData): string {
    const teamNames = gameData.teamNames || ['Team A', 'Team B'];
    const venue = gameData.venue;
    
    let content = `Folks, let me tell you something about this ${teamNames.join(' vs ')} matchup! `;
    
    if (venue) {
      content += `The ${venue} is absolutely rocking tonight! `;
    }
    
    content += `This is the kind of game that reminds you why you love basketball. The passion, the drama, the sheer excitement - it's all here tonight!`;
    
    return content;
  }

  // Generate pre-game style fallback
  private generatePreGameFallback(gameData: GameData): string {
    const teamNames = gameData.teamNames || ['Team A', 'Team B'];
    const venue = gameData.venue;
    
    let content = `Get ready for an absolute thriller tonight as ${teamNames.join(' takes on ')}! `;
    
    if (venue) {
      content += `The ${venue} is going to be electric! `;
    }
    
    content += `This matchup has all the ingredients for an unforgettable night of NBA basketball.`;
    
    return content;
  }

  // Generate halftime style fallback
  private generateHalftimeFallback(gameData: GameData): string {
    const teamNames = gameData.teamNames || ['Team A', 'Team B'];
    
    return `At halftime of this ${teamNames.join(' vs ')} contest, we've seen some incredible basketball. The first half has been a masterclass in competitive spirit, and the second half promises even more excitement!`;
  }

  // Generate post-game style fallback
  private generatePostGameFallback(gameData: GameData): string {
    const teamNames = gameData.teamNames || ['Team A', 'Team B'];
    const scores = gameData.scores;
    const venue = gameData.venue;
    const gameStatus = gameData.gameStatus;

    let content = '';

    if (scores) {
      const winner = scores.home > scores.away ? teamNames[1] : teamNames[0];
      const winningScore = Math.max(scores.home, scores.away);
      const losingScore = Math.min(scores.home, scores.away);

      content = `What an exciting matchup between ${teamNames.join(' and ')}! ${winner} secured a ${winningScore}-${losingScore} victory in this thrilling contest. `;

      if (venue) {
        content += `The game was played at the iconic ${venue}, adding to the electric atmosphere. `;
      }

      if (gameStatus === 'Final') {
        content += `Both teams displayed exceptional skill and determination throughout the game, making this a memorable NBA showdown.`;
      } else {
        content += `The intensity and competitive spirit on display made this a game to remember.`;
      }
    } else {
      content = `The ${teamNames.join(' vs ')} matchup delivered an exciting contest. `;

      if (venue) {
        content += `Taking place at ${venue}, `;
      }

      content += `this game showcased the best of NBA basketball with both teams bringing their A-game to the court.`;
    }

    return content;
  }

  // Get game context summary for metadata
  private getGameContextSummary(gameData: GameData): string {
    const parts = [];
    
    if (gameData.teamNames) {
      parts.push(`${gameData.teamNames.join(' vs ')}`);
    }
    
    if (gameData.scores) {
      parts.push(`${gameData.scores.away}-${gameData.scores.home}`);
    }
    
    if (gameData.gameStatus) {
      parts.push(gameData.gameStatus);
    }
    
    if (gameData.venue) {
      parts.push(`@ ${gameData.venue}`);
    }
    
    return parts.join(' | ') || 'Unknown game';
  }

  // Check if service is ready
  isReady(): boolean {
    return this.isInitialized && this.client !== null;
  }

  // Public method to reinitialize the service (useful after configuration changes)
  async reinitialize(): Promise<void> {
    console.log('🔧 [OPENAI] reinitialize() called');
    this.isInitialized = false;
    this.client = null;
    await this.initialize();
  }

  // Get service status
  async getStatus(): Promise<{ isReady: boolean; hasApiKey: boolean; isInitialized: boolean }> {
    const config = await getValidatedConfig();
    return {
      isReady: this.isReady(),
      hasApiKey: config.openaiApiKey !== undefined,
      isInitialized: this.isInitialized
    };
  }

  // Get service status (sync version for testing)
  getStatusSync(): { isReady: boolean; hasApiKey: boolean; isInitialized: boolean } {
    return {
      isReady: this.isReady(),
      hasApiKey: false, // We can't check this synchronously in the new system
      isInitialized: this.isInitialized
    };
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();

// Export convenience functions
export async function generateSportsCommentary(
  gameData: GameData, 
  style?: CommentaryStyle
): Promise<CommentaryResult> {
  return openAIService.generateSportsCommentary(gameData, style);
}

export function isOpenAIServiceReady(): boolean {
  return openAIService.isReady();
}

export async function getOpenAIServiceStatus() {
  return openAIService.getStatus();
}

// Export test configuration functions
export async function setTestConfig(apiKey: string): Promise<void> {
  return openAIService.setTestConfig(apiKey);
}

export async function clearTestConfig(): Promise<void> {
  return openAIService.clearTestConfig();
}

// Export reinitialize function
export async function reinitializeService(): Promise<void> {
  return openAIService.reinitialize();
}
