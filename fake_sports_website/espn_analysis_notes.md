# ESPN NBA Boxscore Page Analysis

## Overview
Analysis of ESPN's NBA boxscore page (https://www.espn.com/nba/boxscore/_/gameId/401705278) to create an exact replica with "Sports Inc." branding.

## Page Structure

### 1. Header Section
- **Top Scoreboard**: Sports dropdown, date selector, live game scores
- **Global Navigation**: ESPN logo, sport links (NFL, NBA, MLB, etc.), ESPN BET links, search/profile
- **Skip Links**: Accessibility navigation

### 2. Main Content Area
- **Game Title**: "Dallas Mavericks @ Philadelphia 76ers"
- **Score Display**: 
  - Team logos (28x20px)
  - Team names and records
  - Final score (116-118)
  - Game status ("Final")
  - Quarter-by-quarter breakdown table

### 3. Secondary Navigation
- Gamecast, Recap, Box Score, Play-by-Play, Team Stats tabs

### 4. Box Score Tables
- **Team Rosters**: Starters, bench players, team totals
- **Statistics Tables**: MIN, FG, 3PT, FT, OREB, DREB, REB, AST, STL, BLK, TO, PF, +/-, PTS
- **Player Links**: Each player name links to their profile
- **Team Logos**: Larger team logos in box score section

### 5. Sidebar (Complementary Content)
- **Regular Season Series**: Previous games between teams
- **Game Information**: Arena, date/time, attendance, referees
- **Standings Tables**: Southwest and Atlantic division standings
- **NBA News**: Latest news articles with images

### 6. Footer
- ESPN logo
- Legal links (Terms, Privacy, etc.)
- Copyright notice
- ESPN BET disclaimer

## Design Elements

### Color Palette
- **Background**: `rgb(237, 238, 240)` - Light gray
- **Text**: `rgb(43, 44, 45)` - Dark gray/black
- **Font**: `-apple-system, "system-ui", Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif`

### Layout
- **Viewport**: 1200px width
- **Layout**: Header + Main content + Sidebar + Footer
- **Responsive**: Uses flexbox/grid layouts

### Assets
- **Team Logos**: 
  - Small logos: 28x20px (scoreboard)
  - Large logos: Various sizes (box score section)
  - Source: ESPN CDN with scaling parameters
- **Images**: News article thumbnails, arena images

## Technical Implementation Notes

### HTML Structure
- Semantic HTML5 elements (`header`, `nav`, `main`, `aside`, `footer`)
- ARIA roles and labels for accessibility
- Table structures for data display
- Responsive design patterns

### CSS Considerations
- System font stack for cross-platform consistency
- Light color scheme with good contrast
- Table styling for data presentation
- Flexbox/grid for layout

### JavaScript Functionality
- Dynamic content loading
- Interactive elements (dropdowns, tabs)
- Real-time score updates (if applicable)

## Key Components to Replicate

1. **Header with Navigation**
2. **Score Display Section**
3. **Box Score Tables**
4. **Sidebar with Game Info**
5. **Footer**
6. **Responsive Layout**
7. **Team Logo Integration**
8. **Typography and Spacing**

## Branding Changes Required

- Replace "ESPN" with "Sports Inc." throughout
- Update logo references
- Modify footer copyright
- Change navigation branding
- Update any ESPN-specific styling

## Data Structure

The page displays:
- Game metadata (teams, date, venue, attendance)
- Player statistics (individual and team totals)
- Series information
- Division standings
- News articles

This data would need to be structured appropriately for the replica site.
