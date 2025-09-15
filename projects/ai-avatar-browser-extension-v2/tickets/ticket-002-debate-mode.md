# Ticket 002: Debate Mode Implementation

## Title
Implement Interactive Debate Mode with Difficulty Toggle

## Description
Create an interactive debate mode where users can ask Parker questions and receive passionate arguments. Include a difficulty toggle between "Go Easy" and "Go Savage" modes, with appropriate intensity levels for Parker's responses.

## Acceptance Criteria
- [ ] Lightning icon in header is highlighted when Debate Mode is active
- [ ] "Quick Voice (Spacebar)" tooltip appears when hovering over lightning icon
- [ ] Main content area displays "Debate Mode" title with question mark help icon
- [ ] Large light blue-gray interaction box contains:
  - [ ] Microphone icon and "Tap or press Spacebar to ask Parker" text
  - [ ] Large circular black button with white microphone icon
- [ ] Difficulty toggle buttons below interaction box:
  - [ ] "Go Easy" button (light gray background when selected)
  - [ ] "Go Savage" button (red background when selected)
  - [ ] Only one button highlighted at a time
  - [ ] Sticky per page until reset
- [ ] Keyboard icon with "Or type your question" text below toggles
- [ ] Gray "Parker" response box at bottom with mock content
- [ ] Visual feedback when spacebar is pressed (pulsating ring around microphone)
- [ ] Smooth UI transitions and animations
- [ ] All elements match the provided screenshots exactly

## Technical Requirements
- Use React with TypeScript
- Implement shadcn-ui Button and Card components
- Use Tailwind CSS for styling and layout
- Color scheme: Light blue-gray (#E5E7EB) for interaction box, light gray for selected buttons
- Icon library: Lucide React for microphone, keyboard, and question mark icons
- State management for difficulty toggle selection
- Mock data for Parker's responses (e.g., "I respect Giannis, but pure dominance means consistent championships. Where's the consistency?")
- Implement hover effects and tooltips
- Ensure accessibility compliance (keyboard navigation, screen readers)
- Optimize for smooth UI performance

## User Story
As a sports fan, I want to ask Parker debate questions and get passionate responses so that I can engage in sports discussions with an AI commentator who matches my preferred intensity level.

## Definition of Done
- [ ] Debate mode UI matches all provided screenshots exactly
- [ ] Lightning icon highlighting and tooltip work correctly
- [ ] Difficulty toggle buttons function with proper visual states
- [ ] Interaction box and microphone button are properly styled
- [ ] "Parker" response box displays mock content correctly
- [ ] Spacebar visual feedback (pulsating ring) works
- [ ] All hover effects and transitions are smooth
- [ ] UI is responsive and accessible
- [ ] Code is clean, well-structured, and documented
- [ ] Performance requirements met (<200ms load time)
- [ ] Code review completed
- [ ] Testing completed with all interactive elements

## Dependencies
- Ticket 001 (Basic UI Framework)
- Ticket 008 (FastAPI Backend Setup) - Required for AI responses and TTS
- shadcn-ui component library setup
- Tailwind CSS configuration
- Mock data creation for responses

## Effort Estimate
4 days

## Priority
High

## Labels
- frontend
- ui
- interactive
