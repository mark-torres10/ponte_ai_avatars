# Ticket 001: Basic UI Framework Implementation

## Title
Implement Basic UI Framework with Feature Navigation

## Description
Create the foundational UI framework that allows users to click the avatar icon and see the 6 feature modes with hover effects. This ticket establishes the core interface that all other features will build upon.

## Acceptance Criteria
- [ ] Avatar icon appears in browser toolbar
- [ ] Clicking avatar reveals main popup interface (400x600px)
- [ ] Header with "Parker Sports" branding and lightning bolt icon
- [ ] 6 feature icons in 2x3 grid on right side of header:
  - Top row: Speech bubble (filled), Flame, Target/bullseye
  - Bottom row: Play button, Speech bubble (outline), Wi-Fi/radiating waves
- [ ] Main content area shows "Debate Mode" with question mark help icon
- [ ] Large light blue-gray interaction box with microphone instructions
- [ ] Central black circular microphone button (80px diameter)
- [ ] "Go Easy" (selected) and "Go Savage" difficulty toggle buttons
- [ ] Keyboard icon with "Or type your question" text
- [ ] Hover effects on all interactive elements
- [ ] Smooth transitions and animations
- [ ] Clean, modern design using shadcn-ui components

## Technical Requirements
- Use React with TypeScript
- Implement shadcn-ui components (Button, Card, Input, etc.)
- Use Tailwind CSS for styling and layout
- Popup dimensions: 400px width x 600px height
- Color scheme: White background, dark text, light blue-gray (#E5E7EB) for interaction box
- Icon library: Lucide React for consistent iconography
- State management for mode switching and difficulty selection
- Ensure accessibility compliance (keyboard navigation, screen readers)
- Optimize for performance (<200ms load time)
- Follow Chrome extension popup best practices

## User Story
As a sports fan, I want to click on the avatar icon and see all available features so that I can easily navigate to the mode I want to use.

## Definition of Done
- [ ] Main popup interface matches the design exactly
- [ ] All 6 feature icons are properly positioned and styled
- [ ] Lightning bolt icon is highlighted to show active mode
- [ ] Difficulty toggle buttons work with proper visual states
- [ ] Microphone button and interaction box are properly styled
- [ ] All hover effects work smoothly
- [ ] Design matches the provided screenshot exactly
- [ ] Code is properly documented with TypeScript types
- [ ] No accessibility issues (keyboard navigation works)
- [ ] Performance requirements met (<200ms load time)
- [ ] Code review completed
- [ ] Testing completed with all interactive elements

## Dependencies
- Chrome extension manifest setup
- Basic React component structure
- shadcn-ui component library
- Tailwind CSS configuration

## Effort Estimate
3 days

## Priority
High (Blocking for all other features)

## Labels
- frontend
- ui
- foundation
- chrome-extension
