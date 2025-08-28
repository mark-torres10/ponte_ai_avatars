# PON-82: Enhanced ESPN Analysis & Team Detection - Detailed Implementation Plan

## Project Overview

**Ticket**: PON-82 - Enhanced ESPN Analysis & Team Detection  
**Scope**: NBA boxscore pages only (e.g., https://www.espn.com/nba/boxscore/_/gameId/401705278)  
**Timeline**: 2-3 hours focused implementation  
**Goal**: Implement sophisticated team detection, game context parsing, and robust fallback methods  

## Current State Analysis

### **What Already Exists**
- ✅ Basic ESPN detection with URL pattern matching
- ✅ Simple team name extraction using basic DOM selectors
- ✅ Basic `ESPNPageInfo` interface with minimal fields
- ✅ Working avatar placeholder injection

### **What Needs Enhancement**
- ❌ Sophisticated team name extraction with multiple strategies
- ❌ Game context parsing (scores, time, venue, status)
- ❌ Robust fallback detection methods
- ❌ Comprehensive game state object with validation

## Detailed Implementation Plan with Verification

### **Phase 1: Enhanced ESPN Page Detection Logic (30 minutes)**

#### **Step 1: Improve URL Pattern Matching**
**Implementation**: Enhance regex patterns in `analyzeESPNPage()` function

**Automated Tests**:
```typescript
// Test URL pattern matching
describe('ESPN URL Pattern Matching', () => {
  test('should detect NBA boxscore URLs', () => {
    const testUrls = [
      'https://www.espn.com/nba/boxscore/_/gameId/401705278',
      'https://www.espn.com/nba/boxscore/_/gameId/123456789',
      'https://www.espn.com/nba/boxscore/_/gameId/987654321'
    ];
    
    testUrls.forEach(url => {
      const result = analyzeESPNPage();
      expect(result?.isBoxscore).toBe(true);
      expect(result?.gameId).toBeDefined();
    });
  });
  
  test('should reject non-boxscore URLs', () => {
    const invalidUrls = [
      'https://www.espn.com/nba/',
      'https://www.espn.com/nba/game/_/gameId/401705278',
      'https://www.espn.com/nfl/boxscore/_/gameId/401705278'
    ];
    
    // Mock window.location.href and test
  });
});
```

**Manual Verification Steps**:
1. **Navigate to ESPN NBA boxscore page**
   - Go to: `https://www.espn.com/nba/boxscore/_/gameId/401705278`
   - Load the extension in Chrome developer mode
   - Open Chrome DevTools Console (F12)
   
2. **Verify Detection in Console**
   - Should see: `"AI Avatar: ESPN NBA boxscore page detected: {isBoxscore: true, gameId: "401705278", ...}"`
   - Avatar should appear in top-right corner
   
3. **Test Invalid Pages**
   - Go to: `https://www.espn.com/nba/` (main NBA page)
   - Verify: No avatar appears, no console messages
   - Go to: `https://www.espn.com/nba/game/_/gameId/401705278` (game page)
   - Verify: No avatar appears, no console messages

#### **Step 2: Add Page Type Classification**
**Implementation**: Extend detection with specific boxscore page validation

**Automated Tests**:
```typescript
describe('Page Type Classification', () => {
  test('should classify NBA boxscore pages correctly', () => {
    // Mock DOM content for boxscore page
    document.body.innerHTML = `
      <div class="gamepackage-scoreboard">...</div>
      <div class="boxscore">...</div>
    `;
    
    const result = analyzeESPNPage();
    expect(result?.pageType).toBe('nba-boxscore');
  });
});
```

**Manual Verification Steps**:
1. **Verify Boxscore Page Detection**
   - On the example boxscore page, check console for: `pageType: "nba-boxscore"`
   - Verify avatar appears and extension activates
   
2. **Test Non-Boxscore NBA Pages**
   - Go to: `https://www.espn.com/nba/` (main page)
   - Go to: `https://www.espn.com/nba/standings` (standings)
   - Verify: No activation, no avatar

---

### **Phase 2: Sophisticated Team Name Extraction (1 hour)**

#### **Step 1: Implement Multiple DOM Parsing Strategies**

**Implementation**: Create multiple parsing approaches with fallbacks

**Automated Tests**:
```typescript
describe('Team Name Extraction', () => {
  test('should extract team names using primary CSS selectors', () => {
    document.body.innerHTML = `
      <div class="team-name">Lakers</div>
      <div class="team-abbrev">LAL</div>
    `;
    
    const result = extractTeamNames();
    expect(result).toContain('Lakers');
    expect(result).toContain('LAL');
  });
  
  test('should extract team names using secondary text patterns', () => {
    document.body.innerHTML = `
      <h1>Lakers vs Celtics</h1>
      <div class="score">LAL 108 - BOS 102</div>
    `;
    
    const result = extractTeamNames();
    expect(result).toContain('Lakers');
    expect(result).toContain('Celtics');
  });
  
  test('should validate NBA team names', () => {
    const validTeams = ['Lakers', 'Celtics', 'Warriors', 'Heat'];
    const invalidTeams = ['Random Team', '12345', 'Very Long Team Name That Exceeds Limits'];
    
    validTeams.forEach(team => {
      expect(isValidNBATeam(team)).toBe(true);
    });
    
    invalidTeams.forEach(team => {
      expect(isValidNBATeam(team)).toBe(false);
    });
  });
});
```

**Manual Verification Steps**:
1. **Test Primary CSS Selector Strategy**
   - On the example boxscore page, inspect the page source
   - Look for elements with classes like `.team-name`, `.team-abbrev`
   - Verify in console: `"Team names extracted: [Team1, Team2]"`
   
2. **Test Secondary Text Pattern Strategy**
   - Check if team names appear in page headers or titles
   - Verify extraction works even if primary selectors fail
   
3. **Test Team Name Validation**
   - Verify extracted names are actual NBA teams
   - Check console for validation results: `"Validated teams: [Team1, Team2]"`

#### **Step 2: Add Team Name Validation**

**Implementation**: Create NBA team validation logic

**Automated Tests**:
```typescript
describe('Team Name Validation', () => {
  test('should filter out non-team text', () => {
    const mixedContent = ['Lakers', '108', 'Celtics', '102', 'Final'];
    const result = filterValidTeamNames(mixedContent);
    
    expect(result).toContain('Lakers');
    expect(result).toContain('Celtics');
    expect(result).not.toContain('108');
    expect(result).not.toContain('102');
    expect(result).not.toContain('Final');
  });
  
  test('should prevent duplicate team names', () => {
    const duplicateTeams = ['Lakers', 'Lakers', 'Celtics', 'Celtics'];
    const result = removeDuplicateTeams(duplicateTeams);
    
    expect(result).toHaveLength(2);
    expect(result).toContain('Lakers');
    expect(result).toContain('Celtics');
  });
});
```

**Manual Verification Steps**:
1. **Verify Non-Team Text Filtering**
   - Check console for: `"Filtered content: [Team1, Team2]"`
   - Ensure scores, times, and other text are excluded
   
2. **Verify Duplicate Prevention**
   - Check that each team appears only once in results
   - Console should show: `"Final team names: [Team1, Team2]"`

#### **Step 3: Test with Example URL**

**Manual Verification Steps**:
1. **Navigate to Example URL**
   - Go to: `https://www.espn.com/nba/boxscore/_/gameId/401705278`
   - Load extension and open console
   
2. **Verify Team Extraction Accuracy**
   - Console should show: `"Team extraction accuracy: 100%"`
   - Extracted teams should match the actual teams in the game
   - Note the actual team names for comparison
   
3. **Document Results**
   - Record: What teams were detected vs. actual teams
   - Note: Any extraction failures or edge cases
   - Verify: >95% accuracy requirement is met

---

### **Phase 3: Game Context Parsing (1 hour)**

#### **Step 1: Extract Game Scores**

**Implementation**: Parse score elements from boxscore page

**Automated Tests**:
```typescript
describe('Score Extraction', () => {
  test('should extract home and away scores', () => {
    document.body.innerHTML = `
      <div class="score home">108</div>
      <div class="score away">102</div>
    `;
    
    const result = extractGameScores();
    expect(result.home).toBe(108);
    expect(result.away).toBe(102);
  });
  
  test('should handle different score formats', () => {
    const scoreFormats = [
      '<div class="score">108-102</div>',
      '<span>LAL 108, BOS 102</span>',
      '<div>Final: 108-102</div>'
    ];
    
    scoreFormats.forEach(format => {
      document.body.innerHTML = format;
      const result = extractGameScores();
      expect(result.home).toBeDefined();
      expect(result.away).toBeDefined();
    });
  });
});
```

**Manual Verification Steps**:
1. **Verify Score Extraction**
   - On the example boxscore page, check console for: `"Scores extracted: {home: X, away: Y}"`
   - Compare extracted scores with visible scores on page
   - Verify scores are numeric and reasonable (0-200 range)
   
2. **Test Different Score Formats**
   - Look for scores in various locations on the page
   - Check if scores appear in different formats (e.g., "108-102", "LAL 108, BOS 102")
   - Verify extraction works regardless of format

#### **Step 2: Extract Game Time and Status**

**Implementation**: Parse game time and status information

**Automated Tests**:
```typescript
describe('Game Time and Status Extraction', () => {
  test('should extract game status', () => {
    const statusExamples = [
      '<div class="status">Final</div>',
      '<span>Live - Q4 2:30</span>',
      '<div>Q3 8:45</div>'
    ];
    
    statusExamples.forEach(example => {
      document.body.innerHTML = example;
      const result = extractGameStatus();
      expect(result).toBeDefined();
    });
  });
  
  test('should extract game time information', () => {
    document.body.innerHTML = '<div>Q4 2:30</div>';
    const result = extractGameTime();
    
    expect(result.quarter).toBe('Q4');
    expect(result.timeRemaining).toBe('2:30');
  });
});
```

**Manual Verification Steps**:
1. **Verify Game Status Extraction**
   - Check console for: `"Game status: [Status]"`
   - Verify status matches what's visible on page (Final, Live, Q1, Q2, etc.)
   
2. **Verify Game Time Extraction**
   - Check console for: `"Game time: [Quarter] [Time]"`
   - Verify quarter and time remaining are accurate
   - Test on both live and completed games if possible

#### **Step 3: Extract Venue Information**

**Implementation**: Parse venue/arena information

**Automated Tests**:
```typescript
describe('Venue Extraction', () => {
  test('should extract venue information', () => {
    document.body.innerHTML = `
      <div class="venue">Crypto.com Arena</div>
      <div class="location">Los Angeles, CA</div>
    `;
    
    const result = extractVenueInfo();
    expect(result.venue).toBe('Crypto.com Arena');
    expect(result.location).toBe('Los Angeles, CA');
  });
  
  test('should handle missing venue gracefully', () => {
    document.body.innerHTML = '<div>No venue info</div>';
    const result = extractVenueInfo();
    
    expect(result.venue).toBeUndefined();
    expect(result.location).toBeUndefined();
  });
});
```

**Manual Verification Steps**:
1. **Verify Venue Extraction**
   - Check console for: `"Venue: [Venue Name]"`
   - Compare with venue information visible on page
   - Note if venue information is available or missing
   
2. **Test Missing Venue Handling**
   - If venue info is missing, verify graceful handling
   - Console should show: `"Venue: undefined"` without errors

#### **Step 4: Extract Game Metadata**

**Implementation**: Parse additional game information

**Automated Tests**:
```typescript
describe('Game Metadata Extraction', () => {
  test('should extract game date and attendance', () => {
    document.body.innerHTML = `
      <div class="date">Dec 25, 2024</div>
      <div class="attendance">18,997</div>
    `;
    
    const result = extractGameMetadata();
    expect(result.date).toBe('Dec 25, 2024');
    expect(result.attendance).toBe('18,997');
  });
});
```

**Manual Verification Steps**:
1. **Verify Metadata Extraction**
   - Check console for: `"Game metadata: {date: X, attendance: Y, ...}"`
   - Compare extracted data with visible information on page
   - Note which metadata fields are available vs. missing

---

### **Phase 4: Robust Fallback Detection Methods (30 minutes)**

#### **Step 1: Implement Multiple Parsing Strategies**

**Implementation**: Create fallback parsing methods

**Automated Tests**:
```typescript
describe('Fallback Parsing Strategies', () => {
  test('should use fallback when primary parsing fails', () => {
    // Mock primary parsing failure
    jest.spyOn(primaryParser, 'extract').mockReturnValue(null);
    
    const result = extractWithFallbacks();
    expect(result).toBeDefined();
    expect(result.source).toBe('fallback');
  });
  
  test('should try multiple fallback strategies', () => {
    const strategies = ['css-selectors', 'text-patterns', 'content-analysis'];
    const result = extractWithFallbacks();
    
    expect(result.attemptedStrategies).toEqual(strategies);
    expect(result.successfulStrategy).toBeDefined();
  });
});
```

**Manual Verification Steps**:
1. **Test Primary Strategy Failure**
   - Temporarily modify CSS selectors to fail
   - Verify fallback strategies activate
   - Console should show: `"Primary parsing failed, using fallback: [Strategy]"`
   
2. **Verify Fallback Success**
   - Check that data is still extracted despite primary failure
   - Console should show: `"Fallback successful using: [Strategy]"`

#### **Step 2: Add Error Handling**

**Implementation**: Implement graceful degradation

**Automated Tests**:
```typescript
describe('Error Handling', () => {
  test('should handle DOM parsing errors gracefully', () => {
    // Mock DOM errors
    jest.spyOn(document, 'querySelector').mockImplementation(() => {
      throw new Error('DOM Error');
    });
    
    const result = safeExtract();
    expect(result.error).toBeDefined();
    expect(result.fallbackData).toBeDefined();
  });
});
```

**Manual Verification Steps**:
1. **Test Error Scenarios**
   - Check console for error handling messages
   - Verify extension continues to function despite errors
   - Console should show: `"Error handled gracefully, using fallback data"`

---

### **Phase 5: Comprehensive Game State Object (30 minutes)**

#### **Step 1: Extend TypeScript Interfaces**

**Implementation**: Create enhanced interfaces

**Automated Tests**:
```typescript
describe('Enhanced Interfaces', () => {
  test('should extend existing ESPNPageInfo interface', () => {
    const enhancedInfo: EnhancedESPNPageInfo = {
      isBoxscore: true,
      gameId: '401705278',
      teamNames: ['Lakers', 'Celtics'],
      scores: { home: 108, away: 102 },
      gameTime: { quarter: 'Final', timeRemaining: '0:00' },
      gameStatus: 'Final',
      venue: 'Crypto.com Arena',
      metadata: { date: 'Dec 25, 2024' }
    };
    
    expect(enhancedInfo).toBeDefined();
    expect(enhancedInfo.scores).toBeDefined();
    expect(enhancedInfo.gameTime).toBeDefined();
  });
});
```

**Manual Verification Steps**:
1. **Verify Enhanced Data Structure**
   - Check console for complete game state object
   - Verify all new fields are populated: `"Enhanced game state: {scores, gameTime, venue, ...}"`
   - Compare with visible page information

#### **Step 2: Implement Data Builders**

**Implementation**: Create data construction functions

**Automated Tests**:
```typescript
describe('Data Builders', () => {
  test('should build enhanced game state from raw data', () => {
    const rawData = {
      teams: ['Lakers', 'Celtics'],
      scores: '108-102',
      status: 'Final'
    };
    
    const result = buildEnhancedGameState(rawData);
    expect(result.teamNames).toEqual(['Lakers', 'Celtics']);
    expect(result.scores).toEqual({ home: 108, away: 102 });
    expect(result.gameStatus).toBe('Final');
  });
});
```

**Manual Verification Steps**:
1. **Verify Data Building Process**
   - Check console for: `"Building enhanced game state from raw data"`
   - Verify raw data is transformed into structured format
   - Console should show: `"Enhanced game state built successfully"`

#### **Step 3: Update Existing Functions**

**Implementation**: Modify `analyzeESPNPage()` function

**Automated Tests**:
```typescript
describe('Function Updates', () => {
  test('should maintain backward compatibility', () => {
    const result = analyzeESPNPage();
    
    // Original fields should still exist
    expect(result.isBoxscore).toBeDefined();
    expect(result.gameId).toBeDefined();
    expect(result.teamNames).toBeDefined();
    
    // New fields should be available
    expect(result.scores).toBeDefined();
    expect(result.gameTime).toBeDefined();
  });
});
```

**Manual Verification Steps**:
1. **Verify Backward Compatibility**
   - Check that existing functionality still works
   - Avatar should still appear and activate
   - Console should show enhanced data without breaking existing features
   
2. **Test Complete Integration**
   - Verify all new functionality integrates with existing code
   - Check that state management handles new fields
   - Console should show: `"Enhanced ESPN analysis complete"`

---

## Phase 2: Game Context Information Extraction

### **Objective:**
Extract comprehensive game context information including game time, status, venue, location, attendance, and date.

### **Data Fields to Extract:**
- **Game Time**: Quarter information (Q1, Q2, Q3, Q4, OT, Final) and time remaining
- **Game Status**: Current game state (Live, Final, End, Start, etc.)
- **Venue**: Arena/stadium name (e.g., "Wells Fargo Center")
- **Location**: City and state (e.g., "Philadelphia, PA")
- **Attendance**: Number of spectators (e.g., "19,756")
- **Date**: Game date (e.g., "Feb 4, 2025")

### **Implementation Strategy:**
1. **Game Time Extraction**: 
   - Primary: Look for status elements showing quarter/time
   - Fallback: Search main content for quarter patterns
   - Final fallback: Extract from page title

2. **Game Status Extraction**:
   - Primary: Find status elements in scoreboard area
   - Fallback: Extract from page title
   - Final fallback: Search main content for status patterns

3. **Venue & Location Extraction**:
   - Primary: Find "Game Information" section and extract venue/location
   - Fallback: Search list items for venue/location patterns
   - Final fallback: Direct page text search with specific venue patterns

4. **Attendance & Date Extraction**:
   - Primary: Extract from "Game Information" section
   - Fallback: Extract date from page title
   - Final fallback: Direct page text search

### **Verification Steps:**
- [ ] **Automated**: Build extension with `npm run build` (should succeed)
- [ ] **Manual**: Navigate to ESPN NBA boxscore page
- [ ] **Manual**: Open extension and verify all Phase 2 fields are populated
- [ ] **Manual**: Confirm no `undefined` values for any Phase 2 field
- [ ] **Manual**: Verify data accuracy against page content

## Final Verification Checklist

### **Phase 1 Success Criteria:**
- [ ] **Team Names**: Both team names correctly extracted (e.g., "Dallas Mavericks", "Philadelphia 76ers")
- [ ] **Scores**: Actual game scores extracted (e.g., 116-118), not win-loss records
- [ ] **Home/Away**: Correct identification of home vs. away teams
- [ ] **Build Success**: Extension compiles without errors (`npm run build`)

### **Phase 2 Success Criteria:**
- [ ] **Game Time**: Quarter and time remaining correctly extracted (e.g., "Final", "0:00")
- [ ] **Game Status**: Game state correctly identified (e.g., "Final")
- [ ] **Venue**: Arena name correctly extracted (e.g., "Wells Fargo Center")
- [ ] **Location**: City and state correctly extracted (e.g., "Philadelphia, PA")
- [ ] **Attendance**: Number of spectators correctly extracted (e.g., "19,756")
- [ ] **Date**: Game date correctly extracted (e.g., "Feb 4, 2025")
- [ ] **No Undefined Values**: All Phase 2 fields populated with actual data
- [ ] **Data Accuracy**: Extracted data matches page content exactly

### **Overall Success Criteria:**
- [ ] **Complete Data Object**: All required fields populated with correct data
- [ ] **No Console Errors**: Clean console output with only essential logging
- [ ] **Performance**: Extension loads and responds within acceptable time
- [ ] **User Experience**: Extension provides clear, accurate information display
