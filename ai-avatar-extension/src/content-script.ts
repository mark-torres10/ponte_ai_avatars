import { ExtensionMessage, ContentScriptState, EnhancedESPNPageInfo, CommentaryEntry, CommentaryStyle } from './types';
import { generateSportsCommentary, reinitializeService } from './services/openai';
import { saveEnvironmentConfig, loadEnvironmentConfig } from './utils/config';
import { API_KEYS } from './config/keys';

// Content script state
const state: ContentScriptState = {
  isActive: false,
  pageInfo: null,
  avatarVisible: false,
  // Commentary-related state
  commentaryGenerating: false,
  commentaryOverlay: null,
  commentaryContent: null,
  lastGeneratedAt: null,
  loadingState: 'idle',
  // Enhanced state management for Phase 4
  commentaryHistory: [],
  userPreferences: {
    preferredCommentaryStyle: 'post-game',
    autoGenerateOnPageLoad: false,
    enableVoiceSynthesis: false,
    commentaryLength: 'medium',
    showPerformanceMetrics: false
  },
  performanceMetrics: {
    totalCommentariesGenerated: 0,
    averageGenerationTime: 0,
    successRate: 100,
    apiCallCount: 0,
    fallbackUsageCount: 0
  },
  lastPageUrl: null,
  sessionStartTime: new Date(),
  // Dynamic regeneration tracking
  lastCommentaryStyle: null,
  styleChangedSinceLastGeneration: false,
  regenerationAvailable: false,
  // Dialogue UI system state (PON-84)
  dialogueState: {
    isVisible: false,
    currentText: '',
    isStreaming: false,
    availableActions: [],
    position: 'top-right'
  },
  streamingTextState: {
    text: '',
    currentIndex: 0,
    isComplete: false,
    speed: 10
  }
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
  
  // Add click handler for commentary generation
  avatar.addEventListener('click', async () => {
    if (state.commentaryGenerating) {
      console.log('Commentary generation already in progress');
      return;
    }
    
    console.log('Avatar clicked, generating commentary');
    
    // Update state
    state.commentaryGenerating = true;
    state.loadingState = 'loading';
    
    // Show loading state on avatar
    avatar.style.transform = 'scale(1.1)';
    avatar.style.filter = 'brightness(1.2)';
    
    try {
      // Show overlay with loading state
      showCommentaryOverlay();
      
      // Show loading indicator
      if (state.commentaryOverlay) {
        const loadingIndicator = state.commentaryOverlay.querySelector('.loading-indicator');
        const commentaryContent = state.commentaryOverlay.querySelector('.commentary-content');
        
        if (loadingIndicator) (loadingIndicator as HTMLElement).style.display = 'block';
        if (commentaryContent) (commentaryContent as HTMLElement).style.display = 'none';
      }
      
      // Generate commentary using OpenAI service
      const commentary = await generateCommentary();
      
      // Update state
      state.commentaryContent = commentary;
      state.lastGeneratedAt = new Date();
      state.loadingState = 'success';
      
      // Display commentary
      displayCommentary(commentary);
      
      console.log('Commentary generated and displayed successfully');
      
    } catch (error) {
      console.error('Error generating commentary:', error);
      
      // Update state
      state.loadingState = 'error';
      
      // Show error message
      displayError('Failed to generate commentary. Please try again.');
      
    } finally {
      // Reset avatar state
      avatar.style.transform = 'scale(1)';
      avatar.style.filter = 'brightness(1)';
      
      // Update state
      state.commentaryGenerating = false;
    }
  });
  
  return avatar;
}

// Create commentary display overlay
function createCommentaryOverlay(): HTMLElement {
  const overlay = document.createElement('div');
  overlay.id = 'ai-avatar-commentary';
  overlay.className = 'commentary-overlay sports-themed responsive animated';
  
  // Set initial styles
  overlay.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 90% !important;
    max-width: 600px !important;
    max-height: 80vh !important;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
    border-radius: 16px !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
    z-index: 2147483646 !important;
    display: none !important;
    flex-direction: column !important;
    overflow: hidden !important;
    border: 2px solid #e9ecef !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  `;
  
  // Create header
  const header = document.createElement('div');
  header.className = 'commentary-header';
  header.style.cssText = `
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%) !important;
    color: white !important;
    padding: 20px 24px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  `;
  
  const title = document.createElement('h3');
  title.textContent = '🏀 AI Sports Commentary';
  title.style.cssText = `
    margin: 0 !important;
    font-size: 20px !important;
    font-weight: 600 !important;
    color: white !important;
  `;
  
  // Add settings button
  const settingsBtn = document.createElement('button');
  settingsBtn.innerHTML = '⚙️';
  settingsBtn.className = 'settings-button';
  settingsBtn.style.cssText = `
    background: rgba(255, 255, 255, 0.2) !important;
    border: none !important;
    color: white !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    font-size: 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background-color 0.2s ease !important;
    margin-right: 10px !important;
  `;
  
  settingsBtn.addEventListener('mouseenter', () => {
    settingsBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3) !important';
  });
  
  settingsBtn.addEventListener('mouseleave', () => {
    settingsBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2) !important';
  });
  
  settingsBtn.addEventListener('click', () => {
    toggleSettingsPanel();
  });
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.className = 'close-button';
  closeBtn.style.cssText = `
    background: rgba(255, 255, 255, 0.2) !important;
    border: none !important;
    color: white !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    font-size: 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background-color 0.2s ease !important;
  `;
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3) !important';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2) !important';
  });
  
  closeBtn.addEventListener('click', () => {
    hideCommentaryOverlay();
  });
  
  header.appendChild(title);
  header.appendChild(settingsBtn);
  header.appendChild(closeBtn);
  
  // Create content area
  const contentArea = document.createElement('div');
  contentArea.className = 'commentary-content-area';
  contentArea.style.cssText = `
    padding: 24px !important;
    flex: 1 !important;
    overflow-y: auto !important;
    background: white !important;
  `;
  
  // Create loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.style.cssText = `
    display: none !important;
    text-align: center !important;
    padding: 40px 20px !important;
  `;
  
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  spinner.style.cssText = `
    width: 40px !important;
    height: 40px !important;
    border: 4px solid #f3f3f3 !important;
    border-top: 4px solid #ff6b35 !important;
    border-radius: 50% !important;
    animation: spin 1s linear infinite !important;
    margin: 0 auto 20px !important;
  `;
  
  const loadingText = document.createElement('p');
  loadingText.textContent = 'Generating sports commentary...';
  loadingText.style.cssText = `
    margin: 0 !important;
    color: #6c757d !important;
    font-size: 16px !important;
  `;
  
  loadingIndicator.appendChild(spinner);
  loadingIndicator.appendChild(loadingText);
  
  // Create commentary content
  const commentaryContent = document.createElement('div');
  commentaryContent.className = 'commentary-content';
  commentaryContent.style.cssText = `
    display: none !important;
    line-height: 1.6 !important;
    color: #2c3e50 !important;
    font-size: 16px !important;
  `;
  
  contentArea.appendChild(loadingIndicator);
  contentArea.appendChild(commentaryContent);
  
  // Create footer
  const footer = document.createElement('div');
  footer.className = 'commentary-footer';
  footer.style.cssText = `
    background: #f8f9fa !important;
    padding: 16px 24px !important;
    border-top: 1px solid #e9ecef !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    font-size: 14px !important;
  `;
  
  const powerText = document.createElement('span');
  powerText.textContent = 'Powered by AI - Real-time sports analysis';
  powerText.style.cssText = `
    color: #6c757d !important;
  `;
  
  const performanceText = document.createElement('span');
  performanceText.className = 'performance-indicator';
  performanceText.style.cssText = `
    color: #28a745 !important;
    font-weight: 500 !important;
    cursor: pointer !important;
  `;
  performanceText.textContent = `⚡ ${state.performanceMetrics.totalCommentariesGenerated} generated`;
  
  performanceText.addEventListener('click', () => {
    toggleSettingsPanel();
  });
  
  footer.appendChild(powerText);
  footer.appendChild(performanceText);
  
  // Assemble overlay
  overlay.appendChild(header);
  overlay.appendChild(contentArea);
  overlay.appendChild(footer);
  
  // Add click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hideCommentaryOverlay();
    }
  });
  
  return overlay;
}

// Show commentary overlay
function showCommentaryOverlay(): void {
  // TEMPORARY: Test the new DialoguePopup component
  // Comment out the old overlay logic for now
  /*
  if (!state.commentaryOverlay) {
    state.commentaryOverlay = createCommentaryOverlay();
    document.body.appendChild(state.commentaryOverlay);
  }
  
  state.commentaryOverlay.style.display = 'flex';
  state.commentaryOverlay.style.opacity = '0';
  
  // Trigger entrance animation
  requestAnimationFrame(() => {
    if (state.commentaryOverlay) {
      state.commentaryOverlay.style.transition = 'opacity 0.3s ease-in-out';
      state.commentaryOverlay.style.opacity = '1';
    }
  });
  */
  
  // NEW: Test DialoguePopup component
  testDialoguePopup();
}

// Hide commentary overlay
function hideCommentaryOverlay(): void {
  if (state.commentaryOverlay) {
    state.commentaryOverlay.style.transition = 'opacity 0.3s ease-in-out';
    state.commentaryOverlay.style.opacity = '0';
    
    setTimeout(() => {
      if (state.commentaryOverlay) {
        state.commentaryOverlay.style.display = 'none';
      }
    }, 300);
  }
}

// Generate commentary using OpenAI service
async function generateCommentary(): Promise<string> {
  if (!state.pageInfo) {
    throw new Error('No page information available');
  }
  
  const startTime = Date.now();
  
  // Convert page info to game data format expected by OpenAI service
  const gameData = {
    teamNames: state.pageInfo.teamNames,
    scores: state.pageInfo.scores,
    venue: state.pageInfo.venue,
    gameStatus: state.pageInfo.gameStatus,
    gameTime: state.pageInfo.gameTime,
    location: state.pageInfo.location,
    metadata: state.pageInfo.metadata,
    // Add explicit home/away team information for accurate winner calculation
    homeTeam: state.pageInfo.homeTeam,
    awayTeam: state.pageInfo.awayTeam,
    context: {
      rivalry: false, // Could be enhanced later
      playoffImplications: false,
      seasonSeries: undefined,
      keyPlayers: [],
      recentForm: []
    }
  };
  
  try {
    // Update loading state
    state.loadingState = 'loading';
    state.commentaryGenerating = true;
    
    // Update performance metrics
    state.performanceMetrics.apiCallCount++;
    
    // Generate commentary with current style preference
    const result = await generateSportsCommentary(gameData, state.userPreferences.preferredCommentaryStyle);
    
    const generationTime = Date.now() - startTime;
    
    if (result.success && result.commentary) {
      // Track successful generation
      trackCommentarySuccess(result.commentary, generationTime, 'openai');
      
      // Update regeneration state
      state.lastCommentaryStyle = state.userPreferences.preferredCommentaryStyle;
      state.styleChangedSinceLastGeneration = false;
      state.regenerationAvailable = false;
      
      // Update loading state
      state.loadingState = 'success';
      state.commentaryGenerating = false;
      
      console.log(`🎯 [COMMENTARY] Generated ${state.userPreferences.preferredCommentaryStyle} commentary in ${generationTime}ms`);
      
      return result.commentary;
    } else if (result.fallbackContent) {
      // Track fallback usage
      trackCommentaryFallback(result.fallbackContent, generationTime);
      
      // Update loading state
      state.loadingState = 'success';
      state.commentaryGenerating = false;
      
      console.log(`🔄 [COMMENTARY] Using fallback content in ${generationTime}ms`);
      
      return result.fallbackContent;
    } else {
      throw new Error('No commentary content generated');
    }
  } catch (error) {
    // Track error
    const generationTime = Date.now() - startTime;
    trackCommentaryError(error as Error, generationTime);
    
    // Update loading state
    state.loadingState = 'error';
    state.commentaryGenerating = false;
    
    console.error('❌ [COMMENTARY] Error generating commentary:', error);
    
    // Return fallback content
    return generateFallbackCommentary(state.userPreferences.preferredCommentaryStyle);
  }
}

// Generate fallback commentary content
function generateFallbackCommentary(style: CommentaryStyle): string {
  const fallbacks = {
    'post-game': 'What an incredible game we witnessed! The teams gave it their all, showcasing the very best of basketball. The energy in the arena was electric, and the players delivered a performance that will be remembered for seasons to come.',
    'play-by-play': 'The action was non-stop from tip-off to the final buzzer. Every possession mattered, every shot counted, and the intensity never let up. This was basketball at its finest.',
    'analytical': 'From a strategic perspective, this game demonstrated excellent execution on both sides. The coaching decisions, player rotations, and tactical adjustments all played crucial roles in the outcome.',
    'color-commentary': 'The atmosphere here tonight was absolutely electric! You could feel the passion of the fans, the determination of the players, and the sheer excitement of the game. What a night for basketball!',
    'pre-game': 'As we prepare for tip-off, the anticipation is building. Both teams are ready to give their all, and the fans are in for an incredible show. This is going to be a game to remember.',
    'halftime': 'What we\'ve seen so far has been absolutely thrilling. The teams are evenly matched, the energy is high, and the second half promises to be even more exciting. Stay tuned!'
  };
  
  return fallbacks[style] || fallbacks['post-game'];
}

// Display commentary in overlay
function displayCommentary(commentary: string): void {
  if (!state.commentaryOverlay) return;
  
  const loadingIndicator = state.commentaryOverlay.querySelector('.loading-indicator');
  const commentaryContent = state.commentaryOverlay.querySelector('.commentary-content');
  
  if (loadingIndicator) {
    (loadingIndicator as HTMLElement).style.display = 'none';
  }
  
  if (commentaryContent) {
    (commentaryContent as HTMLElement).style.display = 'block';
    (commentaryContent as HTMLElement).innerHTML = formatCommentaryText(commentary);
  }
}

// Display error message in overlay
function displayError(message: string): void {
  if (!state.commentaryOverlay) return;
  
  const loadingIndicator = state.commentaryOverlay.querySelector('.loading-indicator');
  const commentaryContent = state.commentaryOverlay.querySelector('.commentary-content');
  
  if (loadingIndicator) {
    (loadingIndicator as HTMLElement).style.display = 'none';
  }
  
  if (commentaryContent) {
    (commentaryContent as HTMLElement).style.display = 'block';
    (commentaryContent as HTMLElement).innerHTML = `
      <div style="text-align: center; color: #dc3545; padding: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #dc3545;">❌ Error</h4>
        <p style="margin: 0; color: #6c757d;">${message}</p>
      </div>
    `;
  }
}

// Format commentary text with proper line breaks
function formatCommentaryText(text: string): string {
  // Split by sentences and add line breaks
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.map(sentence => sentence.trim()).join('.<br><br>') + '.';
}

// Global function for testing - set configuration from console
(window as any).setExtensionConfig = async function(openaiKey: string, elevenlabsKey: string, voiceId: string) {
  console.log('🔧 [EXTENSION] Setting configuration...');
  
  try {
    await saveEnvironmentConfig({
      openaiApiKey: openaiKey,
      elevenlabsApiKey: elevenlabsKey,
      parkerMunnsVoiceId: voiceId
    });
    
    console.log('✅ [EXTENSION] Configuration saved, reinitializing service...');
    await reinitializeService();
    console.log('✅ [EXTENSION] Service reinitialized successfully');
    
    return { success: true, message: 'Configuration updated successfully' };
  } catch (error) {
    console.error('❌ [EXTENSION] Error setting configuration:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Global function for testing - get current configuration
(window as any).getExtensionConfig = async function() {
  try {
    const config = await loadEnvironmentConfig();
    console.log('🔍 [EXTENSION] Current configuration:', config);
    return config;
  } catch (error) {
    console.error('❌ [EXTENSION] Error getting configuration:', error);
    return null;
  }
};

// Initialize configuration with development keys
async function initializeConfiguration() {
  console.log('🔧 [EXTENSION] Initializing configuration with development keys...');
  
  try {
    // Check if configuration is already set
    const currentConfig = await loadEnvironmentConfig();
    
    if (currentConfig.openaiApiKey && currentConfig.elevenlabsApiKey && currentConfig.parkerMunnsVoiceId) {
      console.log('✅ [EXTENSION] Configuration already set, skipping initialization');
      return;
    }
    
    // Set the development configuration
    await saveEnvironmentConfig({
      openaiApiKey: API_KEYS.OPENAI_API_KEY,
      elevenlabsApiKey: API_KEYS.ELEVENLABS_API_KEY,
      parkerMunnsVoiceId: API_KEYS.ELEVENLABS_PARKER_MUNNS_VOICE_ID
    });
    
    console.log('✅ [EXTENSION] Development configuration set successfully');
    
    // Reinitialize the OpenAI service with the new configuration
    await reinitializeService();
    console.log('✅ [EXTENSION] OpenAI service reinitialized with development keys');
    
  } catch (error) {
    console.error('❌ [EXTENSION] Error initializing configuration:', error);
  }
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
  
  // Automatically initialize configuration with development keys
  initializeConfiguration();
  
  // Load user preferences
  loadUserPreferences();
  
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

// Track successful commentary generation
function trackCommentarySuccess(commentary: string, generationTime: number, source: 'openai' | 'fallback') {
  // Update performance metrics
  state.performanceMetrics.totalCommentariesGenerated++;
  state.performanceMetrics.averageGenerationTime = 
    (state.performanceMetrics.averageGenerationTime * (state.performanceMetrics.totalCommentariesGenerated - 1) + generationTime) / 
    state.performanceMetrics.totalCommentariesGenerated;
  
  // Calculate success rate
  const totalAttempts = state.performanceMetrics.apiCallCount;
  const successfulAttempts = state.performanceMetrics.totalCommentariesGenerated;
  state.performanceMetrics.successRate = (successfulAttempts / totalAttempts) * 100;
  
  // Add to commentary history
  if (state.pageInfo) {
    const historyEntry: CommentaryEntry = {
      id: generateId(),
      timestamp: new Date(),
      gameInfo: {
        teams: state.pageInfo.teamNames || [],
        score: state.pageInfo.scores ? `${state.pageInfo.scores.away}-${state.pageInfo.scores.home}` : undefined,
        venue: state.pageInfo.venue,
        gameStatus: state.pageInfo.gameStatus
      },
      commentary,
      style: state.userPreferences.preferredCommentaryStyle,
      generationTime,
      source,
      pageUrl: window.location.href
    };
    
    state.commentaryHistory.push(historyEntry);
    
    // Keep only last 50 entries to prevent memory bloat
    if (state.commentaryHistory.length > 50) {
      state.commentaryHistory = state.commentaryHistory.slice(-50);
    }
  }
  
  console.log(`📊 [PERFORMANCE] Commentary generated in ${generationTime}ms (${source})`);
}

// Track fallback commentary usage
function trackCommentaryFallback(commentary: string, generationTime: number) {
  state.performanceMetrics.fallbackUsageCount++;
  trackCommentarySuccess(commentary, generationTime, 'fallback');
  console.log(`⚠️ [PERFORMANCE] Fallback commentary used (${generationTime}ms)`);
}

// Track commentary generation errors
function trackCommentaryError(error: Error, generationTime: number) {
  state.performanceMetrics.lastError = error.message;
  state.performanceMetrics.lastErrorTime = new Date();
  
  // Recalculate success rate
  const totalAttempts = state.performanceMetrics.apiCallCount;
  const successfulAttempts = state.performanceMetrics.totalCommentariesGenerated;
  state.performanceMetrics.successRate = (successfulAttempts / totalAttempts) * 100;
  
  console.log(`❌ [PERFORMANCE] Commentary generation failed in ${generationTime}ms: ${error.message}`);
}

// Generate unique ID for history entries
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Toggle settings panel in overlay
function toggleSettingsPanel() {
  if (!state.commentaryOverlay) return;
  
  const contentArea = state.commentaryOverlay.querySelector('.commentary-content-area');
  const loadingIndicator = state.commentaryOverlay.querySelector('.loading-indicator');
  const commentaryContent = state.commentaryOverlay.querySelector('.commentary-content');
  const settingsPanel = state.commentaryOverlay.querySelector('.settings-panel');
  
  if (settingsPanel) {
    // Remove settings panel entirely and show commentary content
    settingsPanel.remove();
    if (commentaryContent) (commentaryContent as HTMLElement).style.display = 'block';
    console.log('🔧 [SETTINGS] Settings panel closed');
  } else {
    // Show settings panel, hide commentary content
    if (loadingIndicator) (loadingIndicator as HTMLElement).style.display = 'none';
    if (commentaryContent) (commentaryContent as HTMLElement).style.display = 'none';
    
    // Create and show settings panel
    const panel = createSettingsPanel();
    contentArea?.appendChild(panel);
    
    // IMPORTANT: Show the panel by setting display to block
    panel.style.display = 'block';
    
    console.log('🔧 [SETTINGS] Settings panel opened');
  }
}

// Create settings panel
function createSettingsPanel(): HTMLElement {
  const settingsPanel = document.createElement('div');
  settingsPanel.className = 'settings-panel';
  settingsPanel.style.cssText = `
    padding: 24px !important;
    display: none !important;
  `;
  
  const settingsTitle = document.createElement('h4');
  settingsTitle.textContent = 'Commentary Settings';
  settingsTitle.style.cssText = `
    margin: 0 0 20px 0 !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #333 !important;
  `;
  
  // Commentary style selector
  const styleSection = document.createElement('div');
  styleSection.style.cssText = `
    margin-bottom: 24px !important;
  `;
  
  const styleLabel = document.createElement('label');
  styleLabel.textContent = 'Commentary Style:';
  styleLabel.style.cssText = `
    display: block !important;
    margin-bottom: 8px !important;
    font-weight: 500 !important;
    color: #555 !important;
  `;
  
  const styleSelect = document.createElement('select');
  styleSelect.className = 'style-selector';
  styleSelect.style.cssText = `
    width: 100% !important;
    padding: 10px 12px !important;
    border: 2px solid #e1e5e9 !important;
    border-radius: 8px !important;
    font-size: 14px !important;
    background: white !important;
    cursor: pointer !important;
    transition: border-color 0.2s ease !important;
  `;
  
  // Add commentary style options
  const styleOptions = [
    { value: 'post-game', label: 'Post-Game Analysis' },
    { value: 'play-by-play', label: 'Play-by-Play Commentary' },
    { value: 'analytical', label: 'Analytical Breakdown' },
    { value: 'color-commentary', label: 'Color Commentary' },
    { value: 'pre-game', label: 'Pre-Game Preview' },
    { value: 'halftime', label: 'Halftime Analysis' }
  ];
  
  styleOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    if (option.value === state.userPreferences.preferredCommentaryStyle) {
      optionElement.selected = true;
    }
    styleSelect.appendChild(optionElement);
  });
  
  // Live style preview
  const stylePreview = document.createElement('div');
  stylePreview.className = 'style-preview';
  stylePreview.style.cssText = `
    margin-top: 8px !important;
    padding: 8px 12px !important;
    background: #f8f9fa !important;
    border-radius: 6px !important;
    font-size: 12px !important;
    color: #6c757d !important;
    font-style: italic !important;
  `;
  stylePreview.textContent = `Current style: ${styleOptions.find(opt => opt.value === state.userPreferences.preferredCommentaryStyle)?.label}`;
  
  // Regenerate button (initially hidden)
  const regenerateBtn = document.createElement('button');
  regenerateBtn.className = 'regenerate-btn';
  regenerateBtn.textContent = '🔄 Regenerate with New Style';
  regenerateBtn.style.cssText = `
    width: 100% !important;
    padding: 12px 16px !important;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    margin-top: 16px !important;
    transition: all 0.2s ease !important;
    display: none !important;
  `;
  
  // Style change handler
  styleSelect.addEventListener('change', (e) => {
    const newStyle = (e.target as HTMLSelectElement).value as CommentaryStyle;
    const oldStyle = state.userPreferences.preferredCommentaryStyle;
    
    // Update user preferences
    state.userPreferences.preferredCommentaryStyle = newStyle;
    
    // Update live preview
    stylePreview.textContent = `Current style: ${styleOptions.find(opt => opt.value === newStyle)?.label}`;
    
    // Check if style changed since last generation
    if (state.lastCommentaryStyle && state.lastCommentaryStyle !== newStyle) {
      state.styleChangedSinceLastGeneration = true;
      state.regenerationAvailable = true;
      
      // Show regenerate button with animation
      regenerateBtn.style.display = 'block';
      regenerateBtn.style.animation = 'fadeInUp 0.3s ease';
      
      console.log(`🔧 [SETTINGS] Style changed from ${oldStyle} to ${newStyle}, regeneration available`);
    }
    
    // Save preferences to storage
    saveUserPreferences();
  });
  
  // Regenerate button click handler
  regenerateBtn.addEventListener('click', async () => {
    if (state.regenerationAvailable && !state.commentaryGenerating) {
      console.log(`🔄 [REGENERATE] Regenerating commentary with new style: ${state.userPreferences.preferredCommentaryStyle}`);
      
      // Hide settings panel and show commentary content
      toggleSettingsPanel();
      
      // Generate new commentary with updated style
      await generateCommentary();
      
      // Reset regeneration state
      state.styleChangedSinceLastGeneration = false;
      state.regenerationAvailable = false;
      regenerateBtn.style.display = 'none';
    }
  });
  
  // Assemble settings panel
  styleSection.appendChild(styleLabel);
  styleSection.appendChild(styleSelect);
  styleSection.appendChild(stylePreview);
  
  settingsPanel.appendChild(settingsTitle);
  settingsPanel.appendChild(styleSection);
  settingsPanel.appendChild(regenerateBtn);
  
  return settingsPanel;
}

// Save user preferences to chrome storage
function saveUserPreferences() {
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ 
      userPreferences: state.userPreferences 
    }, () => {
      console.log('💾 [PREFERENCES] User preferences saved to storage');
    });
  }
}

// Load user preferences from chrome storage
function loadUserPreferences() {
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['userPreferences'], (result) => {
      if (result.userPreferences) {
        state.userPreferences = { ...state.userPreferences, ...result.userPreferences };
        console.log('📂 [PREFERENCES] User preferences loaded from storage');
      }
    });
  }
}

// NEW: Test function for DialoguePopup component
function testDialoguePopup(): void {
  console.log('🧪 [TEST] Testing DialoguePopup component...');
  
  // Create a simple test container for the DialoguePopup
  const testContainer = document.createElement('div');
  testContainer.id = 'dialogue-test-container';
  testContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2147483647;
    pointer-events: none;
  `;
  
  // Create test content for the DialoguePopup
  const testContent = document.createElement('div');
  testContent.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h3 style="color: #333; margin-bottom: 16px;">🧪 Testing DialoguePopup + StreamingText Components</h3>
      <p style="color: #666; margin-bottom: 20px;">
        This is a test of the new professional dialogue UI system (PON-84) with StreamingText.
      </p>
      <div style="background: #f0f0f0; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <strong>Phase 2.2: StreamingText Component Test</strong><br>
        <div id="streaming-text-demo" style="min-height: 60px; text-align: left; margin-top: 12px;">
          <div style="color: #666; font-style: italic;">Click "Start Streaming" to test character-by-character animation...</div>
        </div>
      </div>
      <button id="start-streaming-btn" style="
        background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin: 8px;
        transition: all 0.2s ease;
      ">Start Streaming</button>
      <button id="reset-streaming-btn" style="
        background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin: 8px;
        transition: all 0.2s ease;
      ">Reset</button>
      <p style="color: #888; font-size: 14px; margin-top: 16px;">
        Click the close button to test the exit animation.
      </p>
    </div>
  `;
  
  // Create the DialoguePopup using React
  // For now, we'll create a simple HTML version to test the positioning and styling
  const dialoguePopup = document.createElement('div');
  dialoguePopup.className = 'dialogue-popup-test';
  dialoguePopup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 400px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid #e9ecef;
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
    z-index: 2147483648;
    pointer-events: auto;
    overflow: hidden;
    animation: slideInRight 0.4s ease-out;
  `;
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }
    
    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateX(30px) scale(0.9);
      }
    }
    
    @keyframes charNatural {
      from {
        opacity: 0.8;
        transform: scale(0.98);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    color: white;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  `;
  
  const title = document.createElement('div');
  title.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 12px; height: 12px; background: #fff; border-radius: 50%; animation: pulse 2s infinite;"></div>
      <span style="font-weight: 600; font-size: 16px;">AI Sports Commentary</span>
      <span style="font-size: 14px;">✨</span>
    </div>
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  `;
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    closeBtn.style.transform = 'scale(1.1)';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    closeBtn.style.transform = 'scale(1)';
  });
  
  closeBtn.addEventListener('click', () => {
    // Animate out
    dialoguePopup.style.animation = 'slideOutRight 0.25s ease-in';
    setTimeout(() => {
      testContainer.remove();
      style.remove();
    }, 250);
  });

  // Add streaming text functionality for Phase 2.2 testing
  const streamingDemo = testContent.querySelector('#streaming-text-demo') as HTMLDivElement;
  const startBtn = testContent.querySelector('#start-streaming-btn') as HTMLButtonElement;
  const resetBtn = testContent.querySelector('#reset-streaming-btn') as HTMLButtonElement;
  
  if (streamingDemo && startBtn && resetBtn) {
    const sampleText = "The Lakers are showing incredible resilience tonight, with LeBron James leading the charge. This is exactly the kind of performance that championship teams are made of. The way they're executing on both ends of the floor demonstrates championship-level basketball.";
    let isStreaming = false;
    let currentIndex = 0;
    let streamInterval: ReturnType<typeof setInterval>;
    
    // Start streaming function
    const startStreaming = () => {
      if (isStreaming) return;
      
      isStreaming = true;
      currentIndex = 0;
      startBtn.textContent = 'Streaming...';
      startBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
      startBtn.disabled = true;
      
      // Clear previous content
      streamingDemo.innerHTML = '';
      
      // Create streaming effect (10% faster, natural typing style)
      streamInterval = setInterval(() => {
        if (currentIndex < sampleText.length) {
          const char = sampleText[currentIndex];
          const charSpan = document.createElement('span');
          charSpan.textContent = char === ' ' ? '\u00A0' : char;
          charSpan.style.cssText = `
            display: inline-block;
            opacity: 1;
            transform: none;
            animation: charNatural 0.02s ease-out forwards;
            animation-delay: ${currentIndex * 0.045}s;
          `;
          streamingDemo.appendChild(charSpan);
          currentIndex++;
        } else {
          // Streaming complete
          clearInterval(streamInterval);
          isStreaming = false;
          startBtn.textContent = 'Start Streaming';
          startBtn.style.background = 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
          startBtn.disabled = false;
          
          // Add completion indicator
          const completionDiv = document.createElement('div');
          completionDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: flex-end; margin-top: 12px; color: #28a745;">
              <span style="margin-right: 8px;">✓</span>
              <span style="font-size: 14px; font-weight: 500;">Streaming Complete</span>
            </div>
          `;
          streamingDemo.appendChild(completionDiv);
        }
      }, 45); // ~22 characters per second (10% faster) for natural typing effect
    };
    
    // Reset streaming function
    const resetStreaming = () => {
      if (isStreaming) {
        clearInterval(streamInterval);
        isStreaming = false;
      }
      
      currentIndex = 0;
      startBtn.textContent = 'Start Streaming';
      startBtn.style.background = 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
      startBtn.disabled = false;
      
      streamingDemo.innerHTML = '<div style="color: #666; font-style: italic;">Click "Start Streaming" to test character-by-character animation...</div>';
    };
    
    // Add event listeners
    startBtn.addEventListener('click', startStreaming);
    resetBtn.addEventListener('click', resetStreaming);
    
    // Add hover effects for buttons
    startBtn.addEventListener('mouseenter', () => {
      if (!startBtn.disabled) {
        startBtn.style.transform = 'scale(1.05)';
        startBtn.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
      }
    });
    
    startBtn.addEventListener('mouseleave', () => {
      startBtn.style.transform = 'scale(1)';
      startBtn.style.boxShadow = 'none';
    });
    
    resetBtn.addEventListener('mouseenter', () => {
      resetBtn.style.transform = 'scale(1.05)';
      resetBtn.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.3)';
    });
    
    resetBtn.addEventListener('mouseleave', () => {
      resetBtn.style.transform = 'scale(1)';
      resetBtn.style.boxShadow = 'none';
    });
  }
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Create content
  const content = document.createElement('div');
  content.style.cssText = `
    padding: 24px;
    background: rgba(255, 255, 255, 0.8);
  `;
  content.appendChild(testContent);
  
  // Assemble
  dialoguePopup.appendChild(header);
  dialoguePopup.appendChild(content);
  
  // Add footer accent
  const footer = document.createElement('div');
  footer.style.cssText = `
    height: 4px;
    background: linear-gradient(90deg, #ff6b35, #4a90e2, #ff6b35);
    opacity: 0.6;
  `;
  dialoguePopup.appendChild(footer);
  
  testContainer.appendChild(dialoguePopup);
  document.body.appendChild(testContainer);
  
  console.log('✅ [TEST] DialoguePopup test component created successfully');
}

