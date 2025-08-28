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
  const gameInfoSection = findGameInfoSection();
  const scores = extractGameScores();
  const gameTime = extractGameTime();
  const gameStatus = extractGameStatus();
  const venue = extractVenueInfo(gameInfoSection);
  const metadata = extractGameMetadata(gameInfoSection);
  
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
          return validatedTeams;
        }
      }
    } catch (_error) {
      // Silent error handling
    }
  }
  
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
      teamNames.push(text);
    }
  });
  
  if (teamNames.length >= 2) {
    return teamNames;
  }
  
  return [];
}

// Tertiary strategy: Extract from team links
function extractTeamNamesFromTeamLinks(): string[] {
  const teamNames: string[] = [];
  
  // Look for team names in team links
  const teamLinks = document.querySelectorAll('a[href*="/nba/team/_/name/"]');
  
  teamLinks.forEach(link => {
    const text = link.textContent?.trim();
    if (text && text.length > 0 && text.length < 50) {
      teamNames.push(text);
    }
  });
  
  if (teamNames.length >= 2) {
    return teamNames;
  }
  
  return [];
}

// Filter out invalid team names
function filterValidTeamNames(names: string[]): string[] {
  const validNames = names.filter(name => {
    // Filter out names that are too short, too long, or contain obvious non-team text
    return name.length > 3 && 
           name.length < 50 && 
           !name.includes('Regular Season') && 
           !name.includes('Game Information') && 
           !name.includes('Standings') && 
           !name.includes('NBA News') &&
           !name.includes('Series');
  });
  
  return validNames;
}

// Determine which team is home vs away
function determineHomeAwayTeams(teamNames: string[]): { home: string; away: string } | undefined {
  try {
    // Strategy 1: Use the main heading format "Team1 @ Team2" (Team2 is usually home)
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
        return { away: fullTeam1, home: fullTeam2 };
      }
    }
    
    // Strategy 3: Default to first team as away, second as home (common pattern)
    if (teamNames.length >= 2) {
      return { away: teamNames[0], home: teamNames[1] };
    }
    
  } catch (_error) {
    // Silent error handling
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
            } else if (homeScore === null) {
              homeScore = score;
              break; // We have both scores
            }
          }
        }
      }
    }
    
    if (awayScore !== null && homeScore !== null) {
      return { away: awayScore, home: homeScore };
    }
    
    // Strategy 3: Look for score patterns in the page title or content
    const pageTitle = document.title;
    const scoreMatch = pageTitle.match(/(\d+)-(\d+)/);
    if (scoreMatch) {
      const awayScore = parseInt(scoreMatch[1], 10);
      const homeScore = parseInt(scoreMatch[2], 10);
      if (!isNaN(awayScore) && !isNaN(homeScore)) {
        return { away: awayScore, home: homeScore };
      }
    }
    
  } catch (_error) {
    // Silent error handling
  }
  
  return undefined;
}

// Extract game time information
function extractGameTime(): { quarter: string; timeRemaining: string } | undefined {
  try {
    // Strategy 1: Look for status elements that show quarter/time
    const statusElements = document.querySelectorAll('div[class*="status"], span[class*="status"], div[class*="time"], span[class*="time"]');
    
    for (const element of statusElements) {
      const text = element.textContent?.trim();
      if (text && text.match(/^(Final|Q\d+|OT|End|Start)/i)) {
        const quarter = text;
        const timeRemaining = text === 'Final' || text === 'End' ? '0:00' : '';
        
        return { quarter, timeRemaining };
      }
    }
    
    // Strategy 2: Look for quarter information in the main content
    const mainContent = document.querySelector('main') || document.body;
    if (mainContent) {
      const quarterMatch = mainContent.textContent?.match(/(Q\d+|OT|Final|End|Start)/i);
      if (quarterMatch) {
        const quarter = quarterMatch[1];
        const timeRemaining = quarter === 'Final' || quarter === 'End' ? '0:00' : '';
        
        return { quarter, timeRemaining };
      }
    }
    
    // Strategy 3: Fallback to page title
    const pageTitle = document.title;
    if (pageTitle.includes('Final')) {
      return { quarter: 'Final', timeRemaining: '0:00' };
    }
    
  } catch (_error) {
    // Silent error handling
  }
  
  return undefined;
}

// Extract game status
function extractGameStatus(): string | undefined {
  try {
    // Strategy 1: Look for status elements
    const statusElements = document.querySelectorAll('div[class*="status"], span[class*="status"]');
    
    for (const element of statusElements) {
      const text = element.textContent?.trim();
      if (text && text.match(/^(Final|Live|Q\d+|OT|End|Start)/i)) {
        return text;
      }
    }
    
    // Strategy 2: Fallback to page title
    const pageTitle = document.title;
    if (pageTitle.includes('Final')) {
      return 'Final';
    }
    
    // Strategy 3: Look in main content
    const mainContent = document.querySelector('main') || document.body;
    if (mainContent) {
      const statusMatch = mainContent.textContent?.match(/(Final|Live|Q\d+|OT|End|Start)/i);
      if (statusMatch) {
        return statusMatch[1];
      }
    }
    
  } catch (_error) {
    // Silent error handling
  }
  
  return undefined;
}

// Find the Game Information section
function findGameInfoSection(): Element | null {
  const allH3s = Array.from(document.querySelectorAll('h3'));
  const gameInfoHeading = allH3s.find(
    heading => heading.textContent?.trim() === 'Game Information'
  );

  if (gameInfoHeading) {
    // Look for the next sibling or parent that contains the actual data
    let gameInfoSection = gameInfoHeading.nextElementSibling;
    if (!gameInfoSection) {
      gameInfoSection = gameInfoHeading.parentElement;
    }
    return gameInfoSection;
  }
  
  return null;
}

// Extract venue and location information
function extractVenueInfo(gameInfoSection: Element | null): { venue?: string; location?: string } {
  let venue: string | undefined;
  let location: string | undefined;

  try {
    if (gameInfoSection) {
      // Look for venue name in the section text
      const sectionText = gameInfoSection.textContent || '';

      // Extract venue using regex - look for "Wells Fargo Center" specifically
      const venueMatch = sectionText.match(/([^,\n]+(?:Center|Arena|Stadium|Field|Coliseum))/i);
      if (venueMatch) {
        venue = venueMatch[1].trim();
      }
      
      // Extract location using regex - look for "City, State" pattern
      const locationMatch = sectionText.match(/([A-Za-z\s]+,\s*[A-Z]{2})/);
      if (locationMatch) {
        location = locationMatch[1].trim();
      }
    }

    // Strategy 2: Fallback to broader search if Game Information section not found
    if (!venue || !location) {
      const allListItems = document.querySelectorAll('li');
      
      for (const item of allListItems) {
        const text = item.textContent?.trim();
        if (text) {
          if (!venue && (text.includes('Center') || text.includes('Arena') || text.includes('Stadium'))) {
            venue = text;
          }
          else if (!location && text.includes(',') && text.length < 50 && !text.includes('Attendance')) {
            location = text;
          }
        }
      }
    }

    // Strategy 3: Direct text search in the entire page with better patterns
    if (!venue || !location) {
      const pageText = document.body.textContent || '';
      
      if (!venue) {
        // More specific venue pattern to avoid massive text dumps
        const venueMatch = pageText.match(/(Wells Fargo Center|Madison Square Garden|Staples Center|Chase Center|American Airlines Center|TD Garden|Fiserv Forum|Rocket Mortgage FieldHouse|State Farm Arena|Capital One Arena)/);
        if (venueMatch) {
          venue = venueMatch[1];
        }
      }
      
      if (!location) {
        const locationMatch = pageText.match(/([A-Za-z\s]+,\s*[A-Z]{2})/);
        if (locationMatch) {
          location = locationMatch[1].trim();
        }
      }
    }

  } catch (_error) {
    // Silent error handling
  }

  return { venue, location };
}

// Extract game metadata (date, attendance, officials)
function extractGameMetadata(gameInfoSection: Element | null): { date?: string; attendance?: string } {
  const metadata: { date?: string; attendance?: string } = {};
  
  // Extract date from page title as fallback
  const pageTitle = document.title;
  const dateMatch = pageTitle.match(/(\w+ \d+), (\d{4})/);
  if (dateMatch) {
    metadata.date = `${dateMatch[1]}, ${dateMatch[2]}`;
  }
  
  // Extract from Game Information section
  if (gameInfoSection) {
    const sectionText = gameInfoSection.textContent || '';
    
    // Extract attendance
    const attendanceMatch = sectionText.match(/Attendance:\s*([^,\n]+)/i);
    if (attendanceMatch) {
      metadata.attendance = attendanceMatch[1].trim();
    }
    
    // Extract date from section if not found in title
    if (!metadata.date) {
      const dateMatch = sectionText.match(/(\w+ \d+), (\d{4})/);
      if (dateMatch) {
        metadata.date = `${dateMatch[1]}, ${dateMatch[2]}`;
      }
    }
  }
  
  return metadata;
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
  switch (message.type) {
    case 'PAGE_DETECTED':
      if (!state.isActive) {
        initializeContentScript();
      }
      break;
    default:
      // Silent handling for unknown message types
      break;
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

