import { ExtensionMessage, ContentScriptState, EnhancedESPNPageInfo } from './types';
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
  loadingState: 'idle'
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
    text-align: center !important;
    color: #6c757d !important;
    font-size: 14px !important;
  `;
  
  footer.textContent = 'Powered by AI - Real-time sports analysis';
  
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
  
  // Convert page info to game data format expected by OpenAI service
  const gameData = {
    teamNames: state.pageInfo.teamNames,
    scores: state.pageInfo.scores,
    venue: state.pageInfo.venue,
    gameStatus: state.pageInfo.gameStatus,
    gameTime: state.pageInfo.gameTime,
    location: state.pageInfo.location,
    metadata: state.pageInfo.metadata,
    context: {
      rivalry: false, // Could be enhanced later
      playoffImplications: false,
      seasonSeries: undefined,
      keyPlayers: [],
      recentForm: []
    }
  };
  
  try {
    // Import and use the OpenAI service
    const result = await generateSportsCommentary(gameData, 'post-game');
    
    if (result.success && result.commentary) {
      return result.commentary;
    } else if (result.fallbackContent) {
      return result.fallbackContent;
    } else {
      throw new Error('No commentary content generated');
    }
  } catch (error) {
    console.error('Error calling OpenAI service:', error);
    throw new Error('Failed to generate commentary');
  }
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

