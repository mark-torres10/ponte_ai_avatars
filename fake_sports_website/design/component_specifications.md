# Component Specifications - Sports Inc. NBA Boxscore Replica

## Component Overview

This document defines the detailed specifications for each component in the Sports Inc. NBA Boxscore Replica, based on the ESPN page analysis.

## 1. Header Component

### Purpose
Global navigation and branding for the Sports Inc. website.

### Visual Specifications
- **Height**: 60px
- **Background**: White (#ffffff)
- **Border**: 1px solid #cccccc (bottom)
- **Padding**: 0 16px
- **Layout**: Flexbox horizontal

### Structure
```html
<header class="header">
  <div class="header__top">
    <div class="header__scoreboard">
      <!-- Top scoreboard with live games -->
    </div>
  </div>
  <nav class="header__nav">
    <div class="header__logo">
      <img src="assets/logos/sports-inc-logo.svg" alt="Sports Inc." />
    </div>
    <ul class="header__menu">
      <li><a href="/nfl">NFL</a></li>
      <li><a href="/nba">NBA</a></li>
      <li><a href="/mlb">MLB</a></li>
      <li><a href="/nhl">NHL</a></li>
      <li><a href="/college">College</a></li>
    </ul>
    <div class="header__actions">
      <button class="search-btn">Search</button>
      <button class="user-btn">Sign In</button>
    </div>
  </nav>
</header>
```

### CSS Specifications
```css
.header {
  height: 60px;
  background: white;
  border-bottom: 1px solid #cccccc;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.header__logo img {
  height: 40px;
  width: auto;
}

.header__menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 24px;
}

.header__menu a {
  color: #2b2c2d;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.2s ease;
}

.header__menu a:hover {
  color: #007bff;
}
```

### Accessibility Requirements
- **ARIA Labels**: Navigation landmark
- **Skip Links**: Jump to main content
- **Keyboard Navigation**: Tab order, Enter activation
- **Focus Indicators**: Visible focus states

## 2. Scoreboard Component

### Purpose
Display the main game score and team information.

### Visual Specifications
- **Height**: 80px
- **Background**: White (#ffffff)
- **Padding**: 16px
- **Layout**: Flexbox horizontal
- **Team Logos**: 28x20px

### Structure
```html
<div class="scoreboard">
  <div class="scoreboard__team scoreboard__team--away">
    <img src="assets/logos/mavericks-logo.svg" alt="Dallas Mavericks" class="team-logo" />
    <div class="team-info">
      <span class="team-name">Dallas Mavericks</span>
      <span class="team-record">42-28</span>
    </div>
    <div class="team-score">116</div>
  </div>
  
  <div class="scoreboard__vs">
    <span class="game-status">Final</span>
    <span class="game-time">8:00 PM ET</span>
  </div>
  
  <div class="scoreboard__team scoreboard__team--home">
    <div class="team-score">118</div>
    <div class="team-info">
      <span class="team-name">Philadelphia 76ers</span>
      <span class="team-record">45-25</span>
    </div>
    <img src="assets/logos/76ers-logo.svg" alt="Philadelphia 76ers" class="team-logo" />
  </div>
</div>
```

### CSS Specifications
```css
.scoreboard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #cccccc;
}

.scoreboard__team {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-logo {
  width: 28px;
  height: 20px;
  object-fit: contain;
}

.team-name {
  font-size: 18px;
  font-weight: 600;
  color: #2b2c2d;
}

.team-record {
  font-size: 14px;
  color: #666666;
}

.team-score {
  font-size: 32px;
  font-weight: 700;
  color: #2b2c2d;
}

.scoreboard__vs {
  text-align: center;
}

.game-status {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2b2c2d;
}

.game-time {
  display: block;
  font-size: 12px;
  color: #666666;
}
```

### Accessibility Requirements
- **Alt Text**: Descriptive team logo alt text
- **Semantic Markup**: Proper heading structure
- **Screen Reader**: Announce team names and scores

## 3. Secondary Navigation Component

### Purpose
Tab navigation for different game views (Gamecast, Recap, Box Score, etc.).

### Visual Specifications
- **Height**: 48px
- **Background**: White (#ffffff)
- **Border**: 1px solid #cccccc (bottom)
- **Active Tab**: Blue underline, blue text

### Structure
```html
<nav class="secondary-nav">
  <ul class="nav-tabs">
    <li class="nav-tab nav-tab--active">
      <a href="#gamecast">Gamecast</a>
    </li>
    <li class="nav-tab">
      <a href="#recap">Recap</a>
    </li>
    <li class="nav-tab">
      <a href="#boxscore">Box Score</a>
    </li>
    <li class="nav-tab">
      <a href="#playbyplay">Play-by-Play</a>
    </li>
    <li class="nav-tab">
      <a href="#teamstats">Team Stats</a>
    </li>
  </ul>
</nav>
```

### CSS Specifications
```css
.secondary-nav {
  background: white;
  border-bottom: 1px solid #cccccc;
}

.nav-tabs {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-tab {
  margin: 0;
}

.nav-tab a {
  display: block;
  padding: 12px 16px;
  color: #666666;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-tab--active a {
  color: #007bff;
  border-bottom-color: #007bff;
}

.nav-tab a:hover {
  color: #007bff;
}
```

### JavaScript Functionality
- **Tab Switching**: Show/hide content sections
- **URL Updates**: Update hash for bookmarking
- **Keyboard Navigation**: Arrow keys for tab switching

## 4. Box Score Table Component

### Purpose
Display player statistics in a structured table format.

### Visual Specifications
- **Background**: White (#ffffff)
- **Border**: 1px solid #cccccc
- **Header Background**: #f8f9fa
- **Row Hover**: #e3f2fd
- **Cell Padding**: 8px 12px

### Structure
```html
<div class="boxscore-table">
  <table class="stats-table">
    <thead>
      <tr>
        <th>Player</th>
        <th>MIN</th>
        <th>FGM</th>
        <th>FGA</th>
        <th>FG%</th>
        <th>3PM</th>
        <th>3PA</th>
        <th>3P%</th>
        <th>FTM</th>
        <th>FTA</th>
        <th>FT%</th>
        <th>OREB</th>
        <th>DREB</th>
        <th>REB</th>
        <th>AST</th>
        <th>STL</th>
        <th>BLK</th>
        <th>TO</th>
        <th>PF</th>
        <th>PTS</th>
      </tr>
    </thead>
    <tbody>
      <tr class="player-row">
        <td class="player-cell">
          <span class="player-name">Luka Dončić</span>
          <span class="player-position">PG</span>
        </td>
        <td>38</td>
        <td>12</td>
        <td>25</td>
        <td>48.0</td>
        <!-- ... more stats ... -->
        <td class="points-cell">32</td>
      </tr>
      <!-- ... more players ... -->
    </tbody>
  </table>
</div>
```

### CSS Specifications
```css
.boxscore-table {
  background: white;
  border: 1px solid #cccccc;
  border-radius: 4px;
  overflow: hidden;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th {
  background: #f8f9fa;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #2b2c2d;
  border-bottom: 1px solid #cccccc;
  font-size: 12px;
}

.stats-table td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.player-row:hover {
  background: #e3f2fd;
}

.player-cell {
  text-align: left;
  padding-left: 16px;
}

.player-name {
  font-weight: 600;
  color: #2b2c2d;
}

.player-position {
  color: #666666;
  font-size: 12px;
  margin-left: 8px;
}

.points-cell {
  font-weight: 600;
  color: #2b2c2d;
}
```

### Accessibility Requirements
- **Table Headers**: Proper th elements
- **Scope Attributes**: Column and row headers
- **Screen Reader**: Announce table structure
- **Keyboard Navigation**: Tab through cells

## 5. Sidebar Component

### Purpose
Display additional game information, standings, and news.

### Visual Specifications
- **Width**: 300px (desktop)
- **Background**: White (#ffffff)
- **Border**: 1px solid #cccccc
- **Padding**: 16px
- **Margin**: 16px 0

### Structure
```html
<aside class="sidebar">
  <section class="game-info">
    <h3>Game Information</h3>
    <div class="info-item">
      <span class="info-label">Arena:</span>
      <span class="info-value">Wells Fargo Center</span>
    </div>
    <div class="info-item">
      <span class="info-label">Attendance:</span>
      <span class="info-value">20,478</span>
    </div>
    <div class="info-item">
      <span class="info-label">Officials:</span>
      <span class="info-value">Scott Foster, Tony Brown</span>
    </div>
  </section>
  
  <section class="standings">
    <h3>Eastern Conference</h3>
    <div class="standings-table">
      <!-- Standings content -->
    </div>
  </section>
  
  <section class="news">
    <h3>Related News</h3>
    <div class="news-item">
      <img src="assets/images/news-1.jpg" alt="News headline" />
      <div class="news-content">
        <h4>Mavericks Win Streak Continues</h4>
        <p>Dallas extends their winning streak to 5 games...</p>
      </div>
    </div>
  </section>
</aside>
```

### CSS Specifications
```css
.sidebar {
  width: 300px;
  background: white;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
}

.sidebar h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2b2c2d;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #cccccc;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-label {
  font-weight: 500;
  color: #666666;
}

.info-value {
  color: #2b2c2d;
}

.news-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.news-item img {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.news-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #2b2c2d;
  margin: 0 0 4px 0;
}

.news-content p {
  font-size: 12px;
  color: #666666;
  margin: 0;
  line-height: 1.4;
}
```

## 6. Footer Component

### Purpose
Legal links, branding, and site information.

### Visual Specifications
- **Background**: #f8f9fa
- **Border**: 1px solid #cccccc (top)
- **Padding**: 24px 16px
- **Text**: Small, gray

### Structure
```html
<footer class="footer">
  <div class="footer__content">
    <div class="footer__branding">
      <img src="assets/logos/sports-inc-logo.svg" alt="Sports Inc." />
      <p>&copy; 2024 Sports Inc. All rights reserved.</p>
    </div>
    <div class="footer__links">
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
      <a href="/contact">Contact Us</a>
      <a href="/about">About Sports Inc.</a>
    </div>
  </div>
</footer>
```

### CSS Specifications
```css
.footer {
  background: #f8f9fa;
  border-top: 1px solid #cccccc;
  padding: 24px 16px;
  margin-top: 48px;
}

.footer__content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer__branding img {
  height: 24px;
  margin-bottom: 8px;
}

.footer__branding p {
  font-size: 12px;
  color: #666666;
  margin: 0;
}

.footer__links {
  display: flex;
  gap: 24px;
}

.footer__links a {
  font-size: 12px;
  color: #666666;
  text-decoration: none;
}

.footer__links a:hover {
  color: #007bff;
}
```

## Responsive Behavior

### Mobile Adaptations
- **Header**: Collapsible hamburger menu
- **Scoreboard**: Stacked layout
- **Tables**: Horizontal scroll
- **Sidebar**: Full-width below content
- **Navigation**: Accordion-style tabs

### Tablet Adaptations
- **Header**: Condensed navigation
- **Scoreboard**: Maintain horizontal layout
- **Tables**: Maintain table structure
- **Sidebar**: Maintain width
- **Navigation**: Maintain tab layout

## Component Dependencies

### Asset Dependencies
- **Sports Inc. Logo**: SVG format, multiple sizes
- **Team Logos**: SVG format, 28x20px for scoreboard
- **News Images**: JPEG format, 60x40px thumbnails
- **Icons**: SVG format, 16px, 20px, 24px variants

### CSS Dependencies
- **Design System**: Color palette, typography, spacing
- **Layout Grid**: Responsive breakpoints
- **Component Styles**: Individual component CSS

### JavaScript Dependencies
- **Navigation**: Tab switching functionality
- **Interactions**: Hover states, click handlers
- **Accessibility**: Keyboard navigation, ARIA updates

## Testing Requirements

### Visual Testing
- **Pixel-Perfect**: Exact match with ESPN page
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Responsive**: Mobile, tablet, desktop
- **Accessibility**: Screen reader compatibility

### Functional Testing
- **Navigation**: All links and buttons work
- **Interactions**: Hover states, click handlers
- **Forms**: Input validation and submission
- **Performance**: Load time, smooth animations

### Accessibility Testing
- **WCAG 2.1 AA**: Full compliance
- **Keyboard Navigation**: All elements accessible
- **Screen Reader**: Proper announcements
- **Color Contrast**: 4.5:1 minimum ratio

