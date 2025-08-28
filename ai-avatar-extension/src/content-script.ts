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
  
  // Determine which team is home vs away
  const homeAway = determineHomeAwayTeams(teamNames);
  
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
    homeTeam: homeAway?.home,
    awayTeam: homeAway?.away,
    url
  };
}

// Enhanced team name extraction with multiple strategies
function extractTeamNamesWithFallbacks(): string[] {
  const strategies = [
    extractTeamNamesFromHeading,
    extractTeamNamesFromScoreboard,
    extractTeamNamesFromTeamLinks
  ];
  
  for (const strategy of strategies) {
    try {
      const result = strategy();
      if (result && result.length >= 2) {
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

// Primary strategy: Extract from main game heading
function extractTeamNamesFromHeading(): string[] {
  const teamNames: string[] = [];
  
  // Look for the main game heading: "Dallas Mavericks @ Philadelphia 76ers"
  const mainHeading = document.querySelector('h1');
  if (mainHeading) {
    const headingText = mainHeading.textContent?.trim();
    if (headingText && headingText.includes('@')) {
      const teams = headingText.split('@').map(team => team.trim());
      if (teams.length === 2) {
        teamNames.push(...teams);
        console.log('Teams extracted from heading:', teamNames);
        return teamNames;
      }
    }
  }
  
  return [];
}

// Secondary strategy: Extract from scoreboard area
function extractTeamNamesFromScoreboard(): string[] {
  const teamNames: string[] = [];
  
  // Look for team names in the scoreboard area
  const teamElements = document.querySelectorAll('a[href*="/nba/team/_/name/"]');
  
  teamElements.forEach(element => {
    const text = element.textContent?.trim();
    if (text && text.length > 0 && text.length < 50) {
      // Filter out team abbreviations (DAL, PHI) and keep full names
      if (text.length > 3 && !teamNames.includes(text)) {
        teamNames.push(text);
      }
    }
  });
  
  if (teamNames.length >= 2) {
    console.log('Teams extracted from scoreboard:', teamNames);
    return teamNames;
  }
  
  return [];
}

// Fallback strategy: Extract from team links
function extractTeamNamesFromTeamLinks(): string[] {
  const teamNames: string[] = [];
  
  // Look for team name links in the boxscore
  const teamLinks = document.querySelectorAll('a[href*="/nba/team/_/name/"]');
  
  teamLinks.forEach(link => {
    const text = link.textContent?.trim();
    if (text && text.length > 0 && text.length < 50) {
      // Look for full team names (not abbreviations)
      if (text.length > 3 && !teamNames.includes(text)) {
        teamNames.push(text);
      }
    }
  });
  
  if (teamNames.length >= 2) {
    console.log('Teams extracted from team links:', teamNames);
    return teamNames;
  }
  
  return [];
}

// Filter and validate team names
function filterValidTeamNames(names: string[]): string[] {
  const validTeams = names.filter(name => {
    // Filter out non-team text
    if (name.match(/^\d+$/)) return false; // Numbers only
    if (name.length < 4 || name.length > 30) return false; // Length check
    if (name.match(/^(Final|Live|Q\d+|OT|End|Start|starters|bench|team)/i)) return false; // Game status
    if (name.match(/^\d+:\d+$/)) return false; // Time format
    if (name.match(/^(Regular Season Series|Game Information|NBA News)/i)) return false; // Navigation
    
    return true;
  });
  
  // Remove duplicates
  return [...new Set(validTeams)];
}

// Determine which team is home vs away
function determineHomeAwayTeams(teamNames: string[]): { home: string; away: string } | undefined {
  if (teamNames.length < 2) return undefined;
  
  try {
    // Strategy 1: Check the main heading format "Team1 @ Team2" (Team2 is home)
    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
      const headingText = mainHeading.textContent?.trim();
      if (headingText && headingText.includes('@')) {
        const teams = headingText.split('@').map(team => team.trim());
        if (teams.length === 2) {
          const awayTeam = teams[0];
          const homeTeam = teams[1];
          
          // Verify these teams are in our extracted team names
          if (teamNames.includes(awayTeam) && teamNames.includes(homeTeam)) {
            console.log('Home/Away determined from heading:', { away: awayTeam, home: homeTeam });
            return { away: awayTeam, home: homeTeam };
          }
        }
      }
    }
    
    // Strategy 2: Check the page title format "Team1 Score1-Score2 Team2"
    const pageTitle = document.title;
    const titleMatch = pageTitle.match(/(\w+)\s+(\d+)-(\d+)\s+(\w+)/);
    if (titleMatch) {
      const team1 = titleMatch[1];
      const team2 = titleMatch[4];
      
      // Find full team names that match these abbreviations
      const fullTeam1 = teamNames.find(name => name.includes(team1) || name.includes(team1.charAt(0).toUpperCase() + team1.slice(1)));
      const fullTeam2 = teamNames.find(name => name.includes(team2) || name.includes(team2.charAt(0).toUpperCase() + team2.slice(1)));
      
      if (fullTeam1 && fullTeam2) {
        // In ESPN format, the second team is usually home
        console.log('Home/Away determined from page title:', { away: fullTeam1, home: fullTeam2 });
        return { away: fullTeam1, home: fullTeam2 };
      }
    }
    
    // Strategy 3: Default to first team as away, second as home (common pattern)
    if (teamNames.length >= 2) {
      console.log('Home/Away determined by order (default):', { away: teamNames[0], home: teamNames[1] });
      return { away: teamNames[0], home: teamNames[1] };
    }
    
  } catch (error) {
    console.log('Home/Away determination failed:', error);
  }
  
  return undefined;
}

// Extract game scores - FIXED to get actual game scores, not win-loss records
function extractGameScores(): { home: number; away: number } | undefined {
  try {
    // Strategy 1: Look for the final score in the main scoreboard
    const finalScoreElements = document.querySelectorAll('div[class*="score"], span[class*="score"]');
    
    for (const element of finalScoreElements) {
      const text = element.textContent?.trim();
      if (text && text.match(/^\d+$/)) {
        const score = parseInt(text, 10);
        if (!isNaN(score) && score >= 0 && score <= 200) {
          // This looks like a valid game score
          console.log('Found potential game score:', score);
        }
      }
    }
    
    // Strategy 2: Look for the final score in the boxscore table totals
    const totalRows = document.querySelectorAll('tr');
    let awayScore: number | null = null;
    let homeScore: number | null = null;
    
    for (const row of totalRows) {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        const lastCell = cells[cells.length - 1];
        const text = lastCell.textContent?.trim();
        
        if (text && text.match(/^\d+$/)) {
          const score = parseInt(text, 10);
          if (!isNaN(score) && score >= 0 && score <= 200) {
            // This is likely a team's total score
            if (awayScore === null) {
              awayScore = score;
              console.log('Away team score:', awayScore);
            } else if (homeScore === null) {
              homeScore = score;
              console.log('Home team score:', homeScore);
              break; // We have both scores
            }
          }
        }
      }
    }
    
    if (awayScore !== null && homeScore !== null) {
      console.log('Final scores extracted:', { away: awayScore, home: homeScore });
      return { away: awayScore, home: homeScore };
    }
    
    // Strategy 3: Look for score patterns in the page title or content
    const pageTitle = document.title;
    const scoreMatch = pageTitle.match(/(\d+)-(\d+)/);
    if (scoreMatch) {
      const awayScore = parseInt(scoreMatch[1], 10);
      const homeScore = parseInt(scoreMatch[2], 10);
      if (!isNaN(awayScore) && !isNaN(homeScore)) {
        console.log('Scores extracted from page title:', { away: awayScore, home: homeScore });
        return { away: awayScore, home: homeScore };
      }
    }
    
  } catch (error) {
    console.log('Score extraction failed:', error);
  }
  
  return undefined;
}

// Extract game time and quarter information
function extractGameTime(): { quarter: string; timeRemaining: string } | undefined {
  try {
    // Strategy 1: Look for quarter information in the main scoreboard
    const quarterElements = document.querySelectorAll('[class*="quarter"], [class*="period"], [class*="time"]');
    
    for (const element of quarterElements) {
      const text = element.textContent?.trim();
      if (text) {
        // Look for patterns like "Final", "Q1", "Q2", "OT", etc.
        if (text.match(/^(Final|Q\d+|OT|End|Live)/i)) {
          const quarter = text;
          const timeRemaining = text === 'Final' || text === 'End' ? '0:00' : '';
          
          console.log('Game time extracted:', { quarter, timeRemaining });
          return { quarter, timeRemaining };
        }
      }
    }
    
    // Strategy 2: Look for quarter information in the boxscore tables
    const tableHeaders = document.querySelectorAll('th');
    for (const header of tableHeaders) {
      const text = header.textContent?.trim();
      if (text && text.match(/^(1|2|3|4|T|OT)/)) {
        // This looks like a quarter header
        const quarter = text;
        const timeRemaining = '';
        
        console.log('Game time extracted from table headers:', { quarter, timeRemaining });
        return { quarter, timeRemaining };
      }
    }
    
    // Strategy 3: Look for game status in the page content
    const statusElements = document.querySelectorAll('div, span');
    for (const element of statusElements) {
      const text = element.textContent?.trim();
      if (text && text.match(/^(Final|Live|Q\d+|OT|End)/i)) {
        const quarter = text;
        const timeRemaining = text === 'Final' || text === 'End' ? '0:00' : '';
        
        console.log('Game time extracted from content:', { quarter, timeRemaining });
        return { quarter, timeRemaining };
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
    // Strategy 1: Look for status in the main scoreboard area
    const statusElements = document.querySelectorAll('[class*="status"], [class*="game-status"]');
    
    for (const element of statusElements) {
      const text = element.textContent?.trim();
      if (text && text.match(/^(Final|Live|Q\d+|OT|End|Start)/i)) {
        console.log('Game status extracted:', text);
        return text;
      }
    }
    
    // Strategy 2: Look for status in the page title or content
    const pageTitle = document.title;
    if (pageTitle.includes('Final')) {
      console.log('Game status extracted from title:', 'Final');
      return 'Final';
    }
    
    // Strategy 3: Look for status patterns in the main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
      const statusMatch = mainContent.textContent?.match(/(Final|Live|Q\d+|OT|End|Start)/i);
      if (statusMatch) {
        console.log('Game status extracted from main content:', statusMatch[1]);
        return statusMatch[1];
      }
    }
    
  } catch (error) {
    console.log('Game status extraction failed:', error);
  }
  
  return undefined;
}

// Extract venue and location information
function extractVenueInfo(): { venue?: string; location?: string } {
  try {
    let venue: string | undefined;
    let location: string | undefined;
    
    // Strategy 1: Look for venue information in the "Game Information" section
    const gameInfoSection = Array.from(document.querySelectorAll('h3')).find(h3 => 
      h3.textContent?.includes('Game Information')
    );
    
    if (gameInfoSection) {
      const gameInfoContent = gameInfoSection.nextElementSibling;
      if (gameInfoContent) {
        // Look for venue name
        const venueElements = gameInfoContent.querySelectorAll('li');
        for (const element of venueElements) {
          const text = element.textContent?.trim();
          if (text && (text.includes('Center') || text.includes('Arena') || text.includes('Stadium'))) {
            venue = text;
            console.log('Venue extracted:', venue);
            break;
          }
        }
        
        // Look for location (city, state)
        for (const element of venueElements) {
          const text = element.textContent?.trim();
          if (text && text.includes(',')) {
            location = text;
            console.log('Location extracted:', location);
            break;
          }
        }
      }
    }
    
    // Strategy 2: Look for venue in the page content
    if (!venue) {
      const venueElements = document.querySelectorAll('div, span');
      for (const element of venueElements) {
        const text = element.textContent?.trim();
        if (text && (text.includes('Center') || text.includes('Arena') || text.includes('Stadium'))) {
          venue = text;
          console.log('Venue extracted from content:', venue);
          break;
        }
      }
    }
    
    return { venue, location };
    
  } catch (error) {
    console.log('Venue info extraction failed:', error);
    return {};
  }
}

// Extract game metadata (date, attendance, officials)
function extractGameMetadata(): { date?: string; attendance?: string; officials?: string[] } {
  try {
    let date: string | undefined;
    let attendance: string | undefined;
    let officials: string[] = [];
    
    // Strategy 1: Look for metadata in the "Game Information" section
    const gameInfoSection = Array.from(document.querySelectorAll('h3')).find(h3 => 
      h3.textContent?.includes('Game Information')
    );
    
    if (gameInfoSection) {
      const gameInfoContent = gameInfoSection.nextElementSibling;
      if (gameInfoContent) {
        const metadataElements = gameInfoContent.querySelectorAll('li');
        
        for (const element of metadataElements) {
          const text = element.textContent?.trim();
          if (text) {
            // Extract date
            if (text.includes(',') && text.includes('202') && !date) {
              date = text;
              console.log('Date extracted:', date);
            }
            
            // Extract attendance
            if (text.includes('Attendance:') && !attendance) {
              attendance = text.replace('Attendance:', '').trim();
              console.log('Attendance extracted:', attendance);
            }
            
            // Extract officials
            if (text.includes('Referees:') || text.includes(',')) {
              const officialsText = text.replace('Referees:', '').trim();
              if (officialsText && officialsText.includes(',')) {
                officials = officialsText.split(',').map(official => official.trim());
                console.log('Officials extracted:', officials);
              }
            }
          }
        }
      }
    }
    
    // Strategy 2: Look for date in the page title
    if (!date) {
      const pageTitle = document.title;
      const dateMatch = pageTitle.match(/\(([^)]+)\)/);
      if (dateMatch) {
        date = dateMatch[1];
        console.log('Date extracted from title:', date);
      }
    }
    
    return { date, attendance, officials };
    
  } catch (error) {
    console.log('Game metadata extraction failed:', error);
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

