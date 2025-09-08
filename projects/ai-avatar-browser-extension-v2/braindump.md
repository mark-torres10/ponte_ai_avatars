# AI Avatar Browser Extension V2 - Brain Dump

## Project Overview
Building on the success of the original AI Avatar Browser Extension, we're creating V2 with enhanced interactive features. The client has provided specific feedback requesting 6 distinct modes of interaction with Parker, the AI sports commentator avatar.

## Client Requirements Analysis

### Core Features Requested
1. **Debate Mode** - Interactive Q&A with difficulty toggle (go easy vs go savage)
2. **Hot Take Mode** - Daily outrageous opinions, auto-trigger on ESPN visits
3. **Predictive Mode** - Bold predictions with confidence meter
4. **NBA Recap Mode** - 1-2 minute podcast-style recaps of last night's games
5. **Fan Take Reactions** - Respond to Reddit/ESPN comments
6. **Game Companion Mode** - Live game commentary during quarters/halftime

### UI/UX Requirements
- Click avatar to see feature icons
- Hover effects showing feature names
- Clean, modern interface using shadcn-ui components
- ComfyUI-inspired design patterns
- 7 tickets total: 1 for basic UI + 6 for features

## Technical Context

### Existing Foundation
- Original extension in `/ai-avatar-browser-extension/` has:
  - Chrome extension architecture (content script + background script)
  - OpenAI integration for text generation
  - ElevenLabs for audio synthesis
  - ESPN page detection
  - Basic avatar visualization
  - Backend API structure

### What's Missing (Not Yet Implemented)
- Exa MCP integration
- Wikipedia API integration
- Interactive UI modes
- Real-time data fetching for sports content
- Multiple conversation modes

### Technical Stack
- **Frontend**: React, TypeScript, shadcn-ui, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **APIs**: OpenAI, ElevenLabs, Exa MCP, Wikipedia API
- **Extension**: Chrome Extension Manifest V3
- **Package Manager**: uv (as per project standards)

## Design Patterns from Screenshots

### Initial State
- Avatar icon in browser toolbar
- Click triggers main interface
- Clean, minimal design

### Feature Icons Layout
- Grid layout of feature icons
- Hover states with feature names
- Lightning icon for debate mode
- Fire icon for hot take mode
- Crystal ball for predictions
- Question mark for NBA recap
- Comment bubble for fan reactions
- Game controller for companion mode

### Interactive Elements
- Difficulty toggles (go easy vs go savage)
- Text input fields for questions
- Confidence meters for predictions
- Audio controls and triggers
- Real-time content updates

## Technical Challenges & Considerations

### Data Integration
- **Exa MCP**: For real-time sports data and news
- **Wikipedia API**: For team/player context
- **ESPN API**: For live scores and game data
- **Reddit API**: For fan comment integration

### Performance Requirements
- Real-time data fetching without blocking UI
- Audio streaming and synchronization
- Efficient content script injection
- Minimal memory footprint

### User Experience
- Seamless transitions between modes
- Consistent Parker personality across all features
- Intuitive navigation and controls
- Accessibility considerations

## Questions Requiring Answers

### Technical Questions
1. Should we use the existing backend API or create new endpoints for each mode?
2. How do we handle real-time data updates for live games?
3. What's the optimal way to store user preferences (teams, difficulty settings)?
4. How do we manage API rate limits across multiple services?

### Product Questions
1. Should the extension auto-activate on ESPN or require manual activation?
2. How do we handle Parker's personality consistency across different modes?
3. What's the fallback if APIs are unavailable?
4. Should we implement user authentication for personalized features?

### Design Questions
1. Should all modes be accessible from the main interface or nested?
2. How do we handle mobile responsiveness in the extension popup?
3. What's the optimal audio control placement for each mode?
4. Should we include visual feedback for audio generation progress?

## Potential Risks & Mitigation

### Technical Risks
- **API Dependencies**: Multiple external APIs could cause reliability issues
  - *Mitigation*: Implement fallback content and graceful degradation
- **Performance Impact**: Real-time features might slow down browser
  - *Mitigation*: Optimize data fetching and implement caching
- **Audio Synchronization**: Complex audio features might have sync issues
  - *Mitigation*: Use proven audio libraries and test extensively

### Product Risks
- **Feature Complexity**: 6 different modes might overwhelm users
  - *Mitigation*: Start with core modes, add complexity gradually
- **Content Quality**: AI-generated content might not match Parker's personality
  - *Mitigation*: Develop detailed prompts and test extensively

## Success Criteria (Initial Thoughts)
- All 6 modes implemented and functional
- Smooth UI interactions with hover effects
- Parker's personality consistent across all features
- Real-time data integration working reliably
- Performance impact <200ms on page load
- User engagement >80% for each mode

## Next Steps
1. Create detailed specification document
2. Set up Linear project with 7 tickets
3. Design technical architecture for each mode
4. Implement basic UI framework
5. Build out each feature incrementally

## Dependencies
- Access to Exa MCP API
- Wikipedia API access
- ESPN API or web scraping capabilities
- Reddit API for fan comments
- Existing OpenAI and ElevenLabs integrations
- Chrome extension development environment

## Timeline Considerations
- Basic UI implementation: 2-3 days
- Each feature mode: 3-4 days
- Integration and testing: 2-3 days
- Total estimated: 4-5 weeks

This brain dump captures the initial thoughts and context for the AI Avatar Browser Extension V2 project, building on the existing foundation while adding the requested interactive features.
