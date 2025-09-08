# Ticket 005: NBA Recap Mode Implementation

## Title
Implement NBA Recap Mode with Podcast-Style Commentary

## Description
Create an NBA recap mode where Parker delivers 1-2 minute podcast-style recaps of last night's games. Include options for daily recap (all games) or team-specific recaps, with dramatic intros and emotional reactions.

## Acceptance Criteria
- [ ] Question mark icon in header is highlighted when NBA Recap Mode is active
- [ ] "NBA Recap" tooltip appears when hovering over the question mark icon
- [ ] Main content area displays "NBA Recap" title with question mark help icon
- [ ] Two tab-like buttons are present: "Daily Recap" and "Your Teams"
- [ ] "Daily Recap" button is selected by default (light gray background)
- [ ] "Your Teams" button is unselected by default (white background)
- [ ] Large, light orange-beige rectangular card is displayed below the tabs
- [ ] **When "Daily Recap" is selected:**
  - [ ] Card contains a basketball icon next to "Tap or press Spacebar for recap" text
  - [ ] Large, black circular play button with white triangle icon is centered
- [ ] **When "Your Teams" is selected:**
  - [ ] Card contains a small orange play icon next to "YOUR TEAMS" text at the top
  - [ ] Multi-paragraph mock recap content is displayed with bold/italicized words
  - [ ] Four small, dark gray question mark icons followed by "Parker's Last Night Rundown" at bottom
- [ ] Smooth UI transitions between tab selections
- [ ] All elements match the provided screenshots exactly

## Technical Requirements
- Use React with TypeScript
- Implement shadcn-ui components (Button, Card, Tabs, Tooltip)
- Use Tailwind CSS for styling and layout
- Color scheme: Light orange-beige (#FDF2E7) for card background, light gray for selected tabs
- Icon library: Lucide React for question mark, basketball, and play icons
- State management for tab selection ("Daily Recap" vs "Your Teams")
- Mock data for recap content including:
  - Daily Recap: Basketball icon and "Tap or press Spacebar for recap" text
  - Your Teams: Mock recap text with bold/italicized formatting (e.g., Warriors/Lakers content)
- Implement hover effects and tooltips
- Ensure accessibility compliance (keyboard navigation, screen readers)
- Optimize for smooth UI performance

## User Story
As a sports fan, I want Parker to give me podcast-style recaps of last night's games so that I can stay informed about what happened while being entertained by dramatic commentary.

## Definition of Done
- [ ] NBA Recap Mode UI matches all provided screenshots exactly
- [ ] Question mark icon highlighting and tooltip work correctly
- [ ] "NBA Recap" title and question mark help icon are present
- [ ] "Daily Recap" and "Your Teams" tabs function with proper visual states
- [ ] Orange-beige card displays correct content for both tab states
- [ ] Daily Recap state shows basketball icon and play button correctly
- [ ] Your Teams state shows mock recap content with proper formatting
- [ ] All hover effects and transitions are smooth
- [ ] UI is responsive and accessible
- [ ] Code is clean, well-structured, and documented
- [ ] Performance requirements met (<200ms load time)
- [ ] Code review completed
- [ ] Testing completed with all interactive elements

## Dependencies
- Ticket 001 (Basic UI Framework)
- shadcn-ui component library setup
- Tailwind CSS configuration
- Mock data creation for recap content

## Effort Estimate
4 days

## Priority
Medium

## Labels
- frontend
- backend
- ai-integration
- audio
- recap
