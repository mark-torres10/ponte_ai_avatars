# Ticket 003: Hot Take Mode Implementation

## Title
Implement Hot Take Mode with Daily Outrageous Opinions

## Description
Create a hot take mode UI where Parker displays outrageous daily opinions about sports. This ticket focuses on the visual interface and mock content display for the hot take feature.

## Acceptance Criteria
- [ ] Fire icon in header is highlighted when Hot Take Mode is active
- [ ] "Hot Take" tooltip appears when hovering over the fire icon
- [ ] Main content area displays "Hot Take" title with question mark help icon
- [ ] Dark, rounded rectangular description bubble appears below title with text: "Parker's most outrageous daily opinion with zero filter"
- [ ] Distinct hot take card with light pink/red background and darker pink/red border
- [ ] Inside the hot take card:
  - [ ] Small flame icon and "SPICY" label (white text on red, rounded background) in top-left corner
  - [ ] Mock hot take text displayed in bold, italicized font
- [ ] Placeholder hot take content: "I don't wanna hear another WORD about the Lakers until they WIN something! Three years of 'championship aspirations' and NOTHING to show for it!"
- [ ] Smooth UI transitions and animations
- [ ] All elements match the provided screenshots exactly

## Technical Requirements
- Use React with TypeScript
- Implement shadcn-ui components (Card, Badge, Tooltip)
- Use Tailwind CSS for styling and layout
- Color scheme: Light pink/red (#FECACA) for card background, darker pink/red (#F87171) for border, solid red (#DC2626) for "SPICY" label
- Icon library: Lucide React for flame and question mark icons
- State management for active mode and displaying hot take content
- Mock data for hot take text and description bubble
- Implement hover effects and tooltips
- Ensure accessibility compliance (keyboard navigation, screen readers)
- Optimize for smooth UI performance

## User Story
As a sports fan, I want Parker to deliver outrageous daily hot takes so that I can be entertained by bold, controversial sports opinions that match my daily routine.

## Definition of Done
- [ ] Hot Take Mode UI matches the provided screenshots exactly
- [ ] Fire icon highlighting and tooltip work correctly
- [ ] "Hot Take" title and question mark help icon are present
- [ ] Description bubble with correct text is displayed
- [ ] Hot take card with proper pink/red styling is implemented
- [ ] "SPICY" label with flame icon is correctly positioned and styled
- [ ] Mock hot take content is displayed in bold, italicized font
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
- Mock data creation for hot take content

## Effort Estimate
4 days

## Priority
High

## Labels
- frontend
- ui
- mock-content
