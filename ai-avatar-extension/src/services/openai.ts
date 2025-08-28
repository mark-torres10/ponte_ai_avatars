import OpenAI from 'openai';
import { getValidatedConfig } from '../utils/config';

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
  };
}

export interface CommentaryResult {
  success: boolean;
  commentary?: string;
  error?: string;
  fallbackContent?: string;
  retryAfter?: number;
  source: 'openai' | 'fallback';
}

export interface FallbackContent {
  content: string;
  source: string;
}

// OpenAI service class
export class OpenAIService {
  private client: OpenAI | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      const config = getValidatedConfig();
      
      if (!config.isValid) {
        console.warn('⚠️ OpenAI service initialization failed:', config.errors);
        return;
      }

      if (!config.openaiApiKey) {
        console.warn('⚠️ OpenAI API key not available');
        return;
      }

      this.client = new OpenAI({
        apiKey: config.openaiApiKey,
        dangerouslyAllowBrowser: true // Note: This is for demo purposes only
      });

      this.isInitialized = true;
      console.log('✅ OpenAI service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing OpenAI service:', error);
    }
  }

  // Generate sports commentary from game data
  async generateSportsCommentary(gameData: GameData): Promise<CommentaryResult> {
    try {
      if (!this.isInitialized || !this.client) {
        console.warn('⚠️ OpenAI service not initialized, using fallback');
        return this.generateFallbackCommentary(gameData);
      }

      const prompt = this.buildCommentaryPrompt(gameData);
      console.log('📝 Generated commentary prompt:', prompt);

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert sports commentator specializing in NBA basketball. Generate engaging, informative, and contextually relevant commentary based on the game data provided. Keep responses to 2-4 sentences, focus on key highlights, and maintain an enthusiastic but professional tone.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      const commentary = response.choices[0]?.message?.content;
      
      if (commentary) {
        console.log('✅ Commentary generated successfully');
        return {
          success: true,
          commentary: commentary.trim(),
          source: 'openai'
        };
      } else {
        console.warn('⚠️ No commentary generated from OpenAI, using fallback');
        return this.generateFallbackCommentary(gameData);
      }

    } catch (error: any) {
      console.error('❌ Error generating commentary:', error);
      
      // Handle specific error types
      if (error?.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
          retryAfter: 60,
          fallbackContent: this.generateFallbackCommentary(gameData).fallbackContent,
          source: 'fallback'
        };
      }

      if (error?.status === 401) {
        return {
          success: false,
          error: 'Invalid API key. Please check your OpenAI configuration.',
          fallbackContent: this.generateFallbackCommentary(gameData).fallbackContent,
          source: 'fallback'
        };
      }

      if (error?.message?.includes('timeout')) {
        return {
          success: false,
          error: 'Request timeout. Please try again.',
          fallbackContent: this.generateFallbackCommentary(gameData).fallbackContent,
          source: 'fallback'
        };
      }

      // Generic error handling
      return {
        success: false,
        error: 'Unable to generate commentary at this time.',
        fallbackContent: this.generateFallbackCommentary(gameData).fallbackContent,
        source: 'fallback'
      };
    }
  }

  // Build intelligent prompt for commentary generation
  private buildCommentaryPrompt(gameData: GameData): string {
    let prompt = 'Generate engaging sports commentary for this NBA game:\n\n';

    // Add team information
    if (gameData.teamNames && gameData.teamNames.length >= 2) {
      prompt += `Teams: ${gameData.teamNames.join(' vs ')}\n`;
    }

    // Add score information
    if (gameData.scores) {
      prompt += `Final Score: ${gameData.scores.away}-${gameData.scores.home}\n`;
    }

    // Add venue information
    if (gameData.venue) {
      prompt += `Venue: ${gameData.venue}\n`;
    }

    // Add game status
    if (gameData.gameStatus) {
      prompt += `Game Status: ${gameData.gameStatus}\n`;
    }

    // Add game time information
    if (gameData.gameTime) {
      prompt += `Game Time: ${gameData.gameTime.quarter} ${gameData.gameTime.timeRemaining}\n`;
    }

    // Add location
    if (gameData.location) {
      prompt += `Location: ${gameData.location}\n`;
    }

    // Add metadata
    if (gameData.metadata?.date) {
      prompt += `Date: ${gameData.metadata.date}\n`;
    }

    if (gameData.metadata?.attendance) {
      prompt += `Attendance: ${gameData.metadata.attendance}\n`;
    }

    prompt += '\nPlease provide engaging, contextually relevant commentary that highlights the key aspects of this game. Focus on what makes this matchup interesting and memorable.';

    return prompt;
  }

  // Generate fallback commentary when OpenAI is unavailable
  private generateFallbackCommentary(gameData: GameData): CommentaryResult {
    const fallbackContent = this.getFallbackContent(gameData);
    
    return {
      success: false,
      fallbackContent: fallbackContent.content,
      error: 'Using fallback content due to service unavailability',
      source: 'fallback'
    };
  }

  // Get appropriate fallback content based on game data
  private getFallbackContent(gameData: GameData): FallbackContent {
    const teamNames = gameData.teamNames || ['Team A', 'Team B'];
    const scores = gameData.scores;
    const venue = gameData.venue;
    const gameStatus = gameData.gameStatus;

    let content = '';

    if (scores) {
      const winner = scores.home > scores.away ? teamNames[1] : teamNames[0];
      const loser = scores.home > scores.away ? teamNames[0] : teamNames[1];
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
      content = `The ${teamNames.join(' vs ')} matchup promises to be an exciting contest. `;
      
      if (venue) {
        content += `Taking place at ${venue}, `;
      }
      
      content += `this game showcases the best of NBA basketball with both teams bringing their A-game to the court.`;
    }

    return {
      content,
      source: 'fallback-system'
    };
  }

  // Check if service is ready
  isReady(): boolean {
    return this.isInitialized && this.client !== null;
  }

  // Get service status
  getStatus(): { isReady: boolean; hasApiKey: boolean; isInitialized: boolean } {
    const config = getValidatedConfig();
    return {
      isReady: this.isReady(),
      hasApiKey: config.openaiApiKey !== undefined,
      isInitialized: this.isInitialized
    };
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();

// Export convenience functions
export async function generateSportsCommentary(gameData: GameData): Promise<CommentaryResult> {
  return openAIService.generateSportsCommentary(gameData);
}

export function isOpenAIServiceReady(): boolean {
  return openAIService.isReady();
}

export function getOpenAIServiceStatus() {
  return openAIService.getStatus();
}
