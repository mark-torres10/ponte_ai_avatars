// ESPN page detection types
export interface ESPNPageInfo {
  isBoxscore: boolean;
  gameId?: string;
  teamNames?: string[];
  url: string;
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
