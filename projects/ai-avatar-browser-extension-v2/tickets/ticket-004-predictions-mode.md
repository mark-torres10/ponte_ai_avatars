# Ticket 004: Predictive Mode Implementation

## Title
Implement Predictive Mode with Confidence Meter

## Description
Create a predictive mode UI where users can input game prediction questions and see Parker's bold predictions with a visual confidence meter. This ticket focuses on the visual interface and mock content display for the predictions feature.

## Acceptance Criteria
- [ ] Crystal ball icon in header is highlighted when Predictions Mode is active
- [ ] "Predictions" tooltip appears when hovering over crystal ball icon
- [ ] Main content area displays "Predictions Mode" title with question mark help icon
- [ ] Text input field for game prediction questions
- [ ] Visual confidence meter component displays certainty level (0-100%)
- [ ] Mock prediction responses with dramatic flair and hedging
- [ ] Smooth UI transitions and animations
- [ ] All elements match the provided screenshots exactly

## Technical Requirements
- Use React with TypeScript
- Implement shadcn-ui components (Button, Card, Input, Progress)
- Use Tailwind CSS for styling and layout
- Icon library: Lucide React for crystal ball and question mark icons
- State management for input handling and confidence display
- Mock data for prediction responses with varying confidence levels
- Implement hover effects and tooltips
- Ensure accessibility compliance (keyboard navigation, screen readers)
- Optimize for smooth UI performance

## User Story
As a sports fan, I want to ask Parker about upcoming games and get bold predictions with confidence levels so that I can engage with forward-looking sports analysis in an entertaining way.

## Definition of Done
- [ ] Predictions Mode UI matches all provided screenshots exactly
- [ ] Crystal ball icon highlighting and tooltip work correctly
- [ ] "Predictions Mode" title and question mark help icon are present
- [ ] Text input field functions properly
- [ ] Visual confidence meter displays correctly with mock data
- [ ] Mock prediction responses are displayed with proper formatting
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
- Mock data creation for prediction content

## Effort Estimate
4 days

## Priority
Medium

## Labels
- frontend
- ui
- predictions
