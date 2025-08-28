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
  pageInfo: ESPNPageInfo | null;
  avatarVisible: boolean;
}
