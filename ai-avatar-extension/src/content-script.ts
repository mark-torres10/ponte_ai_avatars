import { ExtensionMessage, ContentScriptState, EnhancedESPNPageInfo } from './types';

// Content script state
const state: ContentScriptState = {
  isActive: false,
  pageInfo: null,
  avatarVisible: false
};

// ESPN page content analysis
function analyzeESPNPage(): EnhancedESPNPageInfo | null {
  const url = window.location.href;
  
  // Enhanced URL pattern matching for NBA boxscore pages
  const isBoxscore = /espn\.com\/nba\/boxscore\/_\/(gameId\/\d+)/.test(url);
  
  if (!isBoxscore) return null;
  
  // Extract game ID from URL
  const gameIdMatch = url.match(/gameId\/(\d+)/);
  const gameId = gameIdMatch ? gameIdMatch[1] : undefined;
  
  // Enhanced page type classification
  const pageType = 'nba-boxscore';
  
  // Extract team names using multiple strategies
  const teamNames = extractTeamNamesWithFallbacks();
  
  // Extract game context information
  const scores = extractGameScores();
  const gameTime = extractGameTime();
  const gameStatus = extractGameStatus();
  const venue = extractVenueInfo();
  const metadata = extractGameMetadata();
  
  // Determine extraction method used
  const extractionMethod = determineExtractionMethod();
  const attemptedStrategies = ['primary', 'fallback-css', 'fallback-text', 'fallback-content'];
  
  return {
    isBoxscore: true,
    pageType,
    gameId,
    teamNames: teamNames.length > 0 ? teamNames : undefined,
    scores,
    gameTime,
    gameStatus,
    venue: venue.venue,
    location: venue.location,
    metadata,
    extractionMethod,
    attemptedStrategies,
    url
  };
}

// Enhanced team name extraction with multiple strategies
function extractTeamNamesWithFallbacks(): string[] {
  const strategies = [
    extractTeamNamesWithCSS,
    extractTeamNamesWithTextPatterns,
    extractTeamNamesWithContentAnalysis
  ];
  
  for (const strategy of strategies) {
    try {
      const result = strategy();
      if (result && result.length > 0) {
        const validatedTeams = filterValidTeamNames(result);
        if (validatedTeams.length >= 2) {
          console.log(`Team extraction successful using: ${strategy.name}`);
          return validatedTeams;
        }
      }
    } catch (error) {
      console.log(`Strategy ${strategy.name} failed:`, error);
    }
  }
  
  console.log('All team extraction strategies failed');
  return [];
}

// Primary CSS selector strategy for team names
function extractTeamNamesWithCSS(): string[] {
  const teamNames: string[] = [];
  
  // Multiple CSS selectors for team names
  const selectors = [
    '.team-name',
    '.team-abbrev',
    '[class*="team"]',
    '.scoreboard-team-name',
    '.gamepackage-scoreboard-team-name',
    'h1',
    'h2',
    'h3'
  ];
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const text = element.textContent?.trim();
      if (text && text.length > 0 && text.length < 50) {
        if (!teamNames.includes(text)) {
          teamNames.push(text);
        }
      }
    });
  });
  
  return teamNames;
}

// Secondary text pattern strategy for team names
function extractTeamNamesWithTextPatterns(): string[] {
  const teamNames: string[] = [];
  
  // Look for team names in page content using text patterns
  const pageText = document.body.textContent || '';
  
  // Common NBA team patterns
  const teamPatterns = [
    /(Lakers|Celtics|Warriors|Heat|Bulls|Knicks|Lakers|Celtics|Warriors|Heat|Bulls|Knicks|Mavericks|Suns|Nets|Clippers|Hawks|Pistons|Rockets|Thunder|Jazz|Trail Blazers|Pelicans|Kings|Timberwolves|Hornets|Magic|Wizards|Pacers|Cavaliers|Bucks|Raptors|76ers|Nuggets|Grizzlies|Spurs)/gi,
    /(LAL|BOS|GSW|MIA|CHI|NYK|DAL|PHX|BKN|LAC|ATL|DET|HOU|OKC|UTA|POR|NOP|SAC|MIN|CHA|ORL|WAS|IND|CLE|MIL|TOR|PHI|DEN|MEM|SAS)/gi
  ];
  
  teamPatterns.forEach(pattern => {
    const matches = pageText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const cleanMatch = match.trim();
        if (cleanMatch.length > 0 && !teamNames.includes(cleanMatch)) {
          teamNames.push(cleanMatch);
        }
      });
    }
  });
  
  return teamNames;
}

// Fallback content analysis strategy
function extractTeamNamesWithContentAnalysis(): string[] {
  const teamNames: string[] = [];
  
  // Analyze page structure for team information
  const scoreElements = document.querySelectorAll('[class*="score"], [class*="team"]');
  
  scoreElements.forEach(element => {
    const text = element.textContent?.trim();
    if (text) {
      // Look for score patterns like "LAL 108 - BOS 102"
      const scorePattern = /([A-Z]{3})\s+(\d+)\s*-\s*([A-Z]{3})\s+(\d+)/;
      const match = text.match(scorePattern);
      
      if (match) {
        const team1 = match[1];
        const team2 = match[3];
        
        if (!teamNames.includes(team1)) teamNames.push(team1);
        if (!teamNames.includes(team2)) teamNames.push(team2);
      }
    }
  });
  
  return teamNames;
}

// Filter and validate team names
function filterValidTeamNames(names: string[]): string[] {
  const validTeams = names.filter(name => {
    // Filter out non-team text
    if (name.match(/^\d+$/)) return false; // Numbers only
    if (name.length < 2 || name.length > 30) return false; // Length check
    if (name.match(/^(Final|Live|Q\d+|OT|End|Start)/i)) return false; // Game status
    if (name.match(/^\d+:\d+$/)) return false; // Time format
    
    return true;
  });
  
  // Remove duplicates
  return [...new Set(validTeams)];
}

// Extract game scores
function extractGameScores(): { home: number; away: number } | undefined {
  try {
    // Multiple strategies for score extraction
    const scoreSelectors = [
      '.score',
      '[class*="score"]',
      '.gamepackage-scoreboard-score',
      '.team-score'
    ];
    
    for (const selector of scoreSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length >= 2) {
        const scores = Array.from(elements).map(el => {
          const text = el.textContent?.trim();
          return text ? parseInt(text, 10) : null;
        });
        
        const validScores = scores.filter(score => score !== null && !isNaN(score)) as number[];
        
        if (validScores.length >= 2) {
          return { home: validScores[0], away: validScores[1] };
        }
      }
    }
    
    // Fallback: look for score patterns in text
    const pageText = document.body.textContent || '';
    const scorePattern = /(\d+)\s*-\s*(\d+)/;
    const match = pageText.match(scorePattern);
    
    if (match) {
      const home = parseInt(match[1], 10);
      const away = parseInt(match[2], 10);
      if (!isNaN(home) && !isNaN(away)) {
        return { home, away };
      }
    }
  } catch (error) {
    console.log('Score extraction failed:', error);
  }
  
  return undefined;
}

// Extract game time information
function extractGameTime(): { quarter: string; timeRemaining: string } | undefined {
  try {
    const timeSelectors = [
      '[class*="time"]',
      '[class*="quarter"]',
      '.game-status',
      '.game-time'
    ];
    
    for (const selector of timeSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text) {
          // Look for quarter patterns
          const quarterMatch = text.match(/(Q\d+|OT|Final|Live)/i);
          const timeMatch = text.match(/(\d+:\d+)/);
          
          if (quarterMatch || timeMatch) {
            return {
              quarter: quarterMatch ? quarterMatch[0] : 'Unknown',
              timeRemaining: timeMatch ? timeMatch[0] : '0:00'
            };
          }
        }
      }
    }
  } catch (error) {
    console.log('Game time extraction failed:', error);
  }
  
  return undefined;
}

// Extract game status
function extractGameStatus(): string | undefined {
  try {
    const statusSelectors = [
      '[class*="status"]',
      '.game-status',
      '.game-state'
    ];
    
    for (const selector of statusSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && text.match(/(Final|Live|Scheduled|Postponed|Cancelled)/i)) {
          return text;
        }
      }
    }
    
    // Fallback: infer from game time
    const gameTime = extractGameTime();
    if (gameTime?.quarter === 'Final') {
      return 'Final';
    } else if (gameTime?.quarter.startsWith('Q')) {
      return 'Live';
    }
  } catch (error) {
    console.log('Game status extraction failed:', error);
  }
  
  return undefined;
}

// Extract venue information
function extractVenueInfo(): { venue?: string; location?: string } {
  try {
    const venueSelectors = [
      '[class*="venue"]',
      '[class*="arena"]',
      '.game-venue',
      '.game-location'
    ];
    
    for (const selector of venueSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && text.length > 0) {
          // Try to separate venue and location
          if (text.includes(',')) {
            const parts = text.split(',');
            return {
              venue: parts[0].trim(),
              location: parts.slice(1).join(',').trim()
            };
          } else {
            return { venue: text };
          }
        }
      }
    }
  } catch (error) {
    console.log('Venue extraction failed:', error);
  }
  
  return {};
}

// Extract game metadata
function extractGameMetadata(): { date?: string; attendance?: string; officials?: string[] } {
  try {
    const metadata: { date?: string; attendance?: string; officials?: string[] } = {};
    
    // Extract date
    const dateSelectors = [
      '[class*="date"]',
      '.game-date',
      '.game-time'
    ];
    
    for (const selector of dateSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && text.match(/\w{3}\s+\d{1,2},?\s+\d{4}/)) {
          metadata.date = text;
          break;
        }
      }
    }
    
    // Extract attendance
    const attendanceSelectors = [
      '[class*="attendance"]',
      '.game-attendance'
    ];
    
    for (const selector of attendanceSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && text.match(/\d{1,3}(,\d{3})*/)) {
          metadata.attendance = text;
          break;
        }
      }
    }
    
    return metadata;
  } catch (error) {
    console.log('Metadata extraction failed:', error);
    return {};
  }
}

// Determine which extraction method was successful
function determineExtractionMethod(): 'primary' | 'fallback-css' | 'fallback-text' | 'fallback-content' {
  // This will be enhanced in Phase 4 with actual fallback logic
  return 'primary';
}

// Create avatar with Parker's image
function createAvatarPlaceholder(): HTMLElement {
  const avatar = document.createElement('div');
  avatar.id = 'ai-avatar-placeholder';
  avatar.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 80px !important;
    height: 80px !important;
    border-radius: 50% !important;
    z-index: 2147483647 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
    cursor: pointer !important;
    transition: transform 0.2s ease !important;
    pointer-events: auto !important;
    transform: translateZ(0) !important;
    overflow: hidden !important;
    border: 3px solid white !important;
  `;
  
  // Create image element for Parker's avatar
  const avatarImg = document.createElement('img');
  avatarImg.src = chrome.runtime.getURL('parker-avatar-80x80.png');
  avatarImg.style.cssText = `
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 50% !important;
  `;
  
  avatar.appendChild(avatarImg);
  
  // Add hover effect
  avatar.addEventListener('mouseenter', () => {
    avatar.style.transform = 'scale(1.1)';
  });
  
  avatar.addEventListener('mouseleave', () => {
    avatar.style.transform = 'scale(1)';
  });
  
  // Add click handler for future functionality
  avatar.addEventListener('click', () => {
    console.log('Avatar clicked - future functionality will be added');
  });
  
  return avatar;
}

// Initialize content script
function initializeContentScript() {
  if (state.isActive) return;
  
  // Analyze the current page
  const pageInfo = analyzeESPNPage();
  if (!pageInfo) return;
  
  state.pageInfo = pageInfo;
  state.isActive = true;
  
  console.log('AI Avatar: ESPN NBA boxscore page detected:', pageInfo);
  
  // Create and inject avatar placeholder
  const avatar = createAvatarPlaceholder();
  
  // Ensure the avatar is added to the document body and has highest priority
  document.body.appendChild(avatar);
  
  // Force the avatar to stay on top by setting additional properties
  avatar.style.setProperty('position', 'fixed', 'important');
  avatar.style.setProperty('z-index', '2147483647', 'important');
  avatar.style.setProperty('top', '20px', 'important');
  avatar.style.setProperty('right', '20px', 'important');
  
  // Add a CSS class for additional styling if needed
  avatar.classList.add('ai-avatar-extension');
  
  state.avatarVisible = true;
  
  // Notify background script
  chrome.runtime.sendMessage({
    type: 'AVATAR_ACTIVATE',
    payload: pageInfo
  } as ExtensionMessage);
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  switch (message.type) {
    case 'PAGE_DETECTED':
      if (!state.isActive) {
        initializeContentScript();
      }
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
  
  sendResponse({ success: true });
});

// Auto-initialize if page is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
  initializeContentScript();
}

// Handle page navigation (for SPA-like behavior)
let currentUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    // Reset state and re-initialize
    state.isActive = false;
    state.avatarVisible = false;
    
    // Remove existing avatar
    const existingAvatar = document.getElementById('ai-avatar-placeholder');
    if (existingAvatar) {
      existingAvatar.remove();
    }
    
    // Re-initialize after a short delay
    setTimeout(initializeContentScript, 100);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Ensure avatar stays visible on scroll and other events
function ensureAvatarVisibility() {
  const avatar = document.getElementById('ai-avatar-placeholder');
  if (avatar && state.avatarVisible) {
    // Force the avatar to stay on top
    avatar.style.setProperty('position', 'fixed', 'important');
    avatar.style.setProperty('z-index', '2147483647', 'important');
    avatar.style.setProperty('top', '20px', 'important');
    avatar.style.setProperty('right', '20px', 'important');
    avatar.style.setProperty('display', 'flex', 'important');
  }
}

// Add event listeners to ensure avatar stays visible
window.addEventListener('scroll', ensureAvatarVisibility);
window.addEventListener('resize', ensureAvatarVisibility);
window.addEventListener('load', ensureAvatarVisibility);

// Periodically check avatar visibility (fallback)
setInterval(ensureAvatarVisibility, 2000);
