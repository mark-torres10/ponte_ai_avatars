// ESPN page detection types
export interface ESPNPageInfo {
  isBoxscore: boolean;
  gameId?: string;
  teamNames?: string[];
  url: string;
}

// Enhanced ESPN page info with game context
export interface EnhancedESPNPageInfo extends ESPNPageInfo {
  pageType: 'nba-boxscore';
  scores?: {
    home: number;
    away: number;
  };
  gameTime?: {
    quarter: string;
    timeRemaining: string;
  };
  gameStatus?: string;
  venue?: string;
  location?: string;
  homeTeam?: string;
  awayTeam?: string;
  metadata?: {
    date?: string;
    attendance?: string;
  };
  extractionMethod: 'primary' | 'fallback-css' | 'fallback-text' | 'fallback-content';
  attemptedStrategies: string[];
}

// Extension message types
export interface ExtensionMessage {
  type: 'PAGE_DETECTED' | 'AVATAR_ACTIVATE' | 'AVATAR_DEACTIVATE';
  payload: any;
}

// Avatar configuration
export interface AvatarConfig {
  enabled: boolean;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size: number;
}

// Content script state
export interface ContentScriptState {
  isActive: boolean;
  pageInfo: EnhancedESPNPageInfo | null;
  avatarVisible: boolean;
  // Commentary-related state
  commentaryGenerating: boolean;
  commentaryOverlay: HTMLElement | null;
  commentaryContent: string | null;
  lastGeneratedAt: Date | null;
  loadingState: 'idle' | 'loading' | 'success' | 'error';
  // Enhanced state management for Phase 4
  commentaryHistory: CommentaryEntry[];
  userPreferences: UserPreferences;
  performanceMetrics: PerformanceMetrics;
  lastPageUrl: string | null;
  sessionStartTime: Date | null;
  // Dynamic regeneration tracking
  lastCommentaryStyle: CommentaryStyle | null;
  styleChangedSinceLastGeneration: boolean;
  regenerationAvailable: boolean;
}

// Commentary history entry
export interface CommentaryEntry {
  id: string;
  timestamp: Date;
  gameInfo: {
    teams: string[];
    score?: string;
    venue?: string;
    gameStatus?: string;
  };
  commentary: string;
  style: CommentaryStyle;
  generationTime: number;
  source: 'openai' | 'fallback';
  pageUrl: string;
}

// User preferences for commentary
export interface UserPreferences {
  preferredCommentaryStyle: CommentaryStyle;
  autoGenerateOnPageLoad: boolean;
  enableVoiceSynthesis: boolean;
  commentaryLength: 'short' | 'medium' | 'long';
  showPerformanceMetrics: boolean;
}

// Performance tracking metrics
export interface PerformanceMetrics {
  totalCommentariesGenerated: number;
  averageGenerationTime: number;
  successRate: number;
  lastError?: string;
  lastErrorTime?: Date;
  apiCallCount: number;
  fallbackUsageCount: number;
}

// Commentary style types
export type CommentaryStyle = 'play-by-play' | 'analytical' | 'color-commentary' | 'post-game' | 'pre-game' | 'halftime';
