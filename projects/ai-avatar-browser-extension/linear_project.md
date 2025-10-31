# AI Avatar Browser Extension - Linear Project

**Linear Project ID**: 279f1ea5-1fc4-4ece-a82a-ad027e7043a3  
**Linear Project URL**: https://linear.app/metresearch/project/ai-avatar-browser-extension-proactive-sports-commentary-mvp-1efe1316af16

## Project Title
AI Avatar Browser Extension - Proactive Sports Commentary MVP

## Problem Statement
Sports fans currently consume sports content passively on ESPN, missing contextual information that could enhance their understanding and engagement. When viewing NBA game scores, users lack immediate access to relevant background information about teams, players, and game context.

## Project Objectives
1. **Demonstrate Proactive AI Interaction**: Build a browser extension that automatically provides contextual sports information without user input
2. **Validate New Product Direction**: Test the concept of AI avatars as proactive assistants rather than reactive chatbots
3. **Create Technical Foundation**: Establish the architecture for browser extension + backend API integration
4. **Deliver User Value**: Enhance sports content consumption with immediate, relevant context

## Success Criteria
- Extension successfully activates on 90%+ of ESPN NBA boxscore page visits
- Avatar provides relevant Wikipedia information 95%+ of the time
- Users listen to full commentary 80%+ of the time
- Page loading impact remains under 100ms
- Extension works without crashes for 99%+ of page visits

## Scope
### In Scope (MVP)
- Chrome browser extension (developer mode)
- ESPN NBA boxscore page detection (URL pattern: `/nba/boxscore/_/gameId/*`)
- Static avatar visualization (generic sports commentator in circle)
- Top-right corner positioning with automatic activation
- Wikipedia first paragraph integration via OpenAI commentary
- ElevenLabs audio synthesis
- Simple backend API for API management
- 1-week development timeline

### Out of Scope
- Firefox/Safari compatibility
- Mobile browser support
- User customization options
- Multiple avatar personalities
- Interactive conversations
- Social sharing features
- Monetization features
- Other sports or content sources

## Timeline
**Total Duration**: 1 week
**Start Date**: [TBD]
**Target Completion**: [TBD + 1 week]

### Phase Breakdown
- **Phase 1 (Days 1-2)**: Extension foundation and ESPN detection
- **Phase 2 (Days 3-4)**: Backend API and AI integration  
- **Phase 3 (Days 5-6)**: Avatar UI and audio integration
- **Phase 4 (Day 7)**: Testing, refinement, and deployment

## Team Composition
- **Project Lead**: [TBD]
- **Frontend Developer**: [TBD] - Extension development
- **Backend Developer**: [TBD] - API development
- **AI Integration**: [TBD] - OpenAI and ElevenLabs integration

## Risk Mitigation Strategies
- **Technical Risks**: Start with proven APIs and simple extension architecture
- **Timeline Risks**: Focus on core functionality, defer enhancements
- **API Risks**: Implement rate limiting and fallback content
- **Performance Risks**: Minimal DOM manipulation, efficient content detection

## Dependencies
- OpenAI API access and credits
- ElevenLabs API access
- Wikipedia API availability
- Chrome extension development environment
- Backend hosting (Vercel/Netlify)

## Key Deliverables
1. Working Chrome extension that detects ESPN NBA boxscore pages
2. Backend API with OpenAI, Wikipedia, and ElevenLabs integration
3. Avatar UI component with audio output
4. Complete user flow from page detection to audio commentary
5. Developer mode installation and testing documentation

## Success Metrics
- Extension activation rate on target pages
- Content relevance and accuracy
- User engagement with audio commentary
- Performance impact on page loading
- Technical reliability and crash rate

## Future Roadmap
- Multiple sports coverage (NFL, MLB, etc.)
- User customization and preferences
- Interactive conversations with avatar
- Mobile app version
- Monetization features
- Partnership opportunities with sports organizations

## Pull Requests

| Ticket | Title | Status | PR URL | Notes |
|--------|-------|--------|---------|-------|
| PON-77 | Backend API Development | In Progress | [PR #43](https://github.com/mark-torres10/ponte_ai_avatars/pull/43) | Backend structure copied and ready for sports commentary endpoints |
