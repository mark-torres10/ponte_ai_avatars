# AI Avatar Browser Extension - Brain Dump

## Project Concept
- Browser extension that activates when users visit sports sites (starting with ESPN)
- AI avatar provides real-time, contextual commentary about what users are viewing
- Similar to Cluely but focused on sports content and AI avatar interaction
- MVP: NBA basketball content with Wikipedia integration

## Core Use Case
- User visits ESPN.com
- Goes to NBA game scores page specifically
- Extension detects the page content automatically
- AI avatar appears as a floating commentator (static image in circle)
- Avatar automatically starts talking about the teams
- Provides context from Wikipedia first paragraph
- Demonstrates proactive AI interaction (not reactive chatbot)

## Technical Components Identified
- Browser extension (Chrome/Firefox) - developer mode for quick testing
- Simple backend API (Node.js/Express)
- OpenAI streaming API for text generation
- ElevenLabs streaming for audio output
- ESPN game scores page detection
- Wikipedia API integration
- Static avatar visualization (circle profile image)

## Key Questions to Explore
1. **Extension Architecture**: How should the extension detect sports content? URL patterns? Content analysis?
2. **Avatar Design**: What should the avatar look like? Should it be customizable? How prominent should it be?
3. **Content Detection**: How do we reliably identify NBA content vs other sports? What about different ESPN page types?
4. **User Experience**: How intrusive should the avatar be? Should users be able to control when it activates?
5. **Content Sources**: Wikipedia first paragraph is good for MVP, but what other sources could we integrate?
6. **Performance**: How do we ensure the extension doesn't slow down page loading?
7. **Audio Experience**: Should audio auto-play? How do we handle multiple tabs/pages?

## Potential Challenges
- Browser extension permissions and security
- ESPN page content detection accuracy (game scores vs other content)
- Wikipedia API rate limits and content availability
- Audio streaming performance and interruption handling
- User privacy concerns with page content analysis
- Cross-browser compatibility (starting with Chrome)
- Extension performance impact on page loading
- Handling cases where no relevant Wikipedia content exists

## MVP Scope Boundaries
- ESPN.com only (to start)
- NBA boxscore pages only (URL pattern: /nba/boxscore/_/gameId/*)
- Wikipedia first paragraph integration
- Static avatar visualization (generic sports commentator in circle)
- Avatar positioned in top-right corner
- Text-to-speech output
- Automatic activation (no user control needed)
- Single hardcoded voice/personality
- Developer mode extension for quick testing
- 1-week development timeline

## Future Enhancements
- Multiple sports (NFL, MLB, etc.)
- Multiple content sources
- Personalized avatar preferences
- Interactive conversations
- Social sharing features
- Mobile app version

## Stakeholders
- Sports fans (primary users)
- Content creators (potential partners)
- Sports organizations (potential licensing)
- Browser users (general adoption)

## Success Metrics
- Extension installs and active users
- User engagement (how often avatar activates)
- Content accuracy and relevance
- User satisfaction and retention
- Performance impact on page loading

## Technical Stack Considerations
- **Separate Project Structure**: Completely independent from existing `src/` folder
- Frontend: React/TypeScript for extension
- Backend: Node.js/Express for API calls
- AI: OpenAI API for content generation (separate from existing implementation)
- Audio: ElevenLabs for voice synthesis
- Storage: Local storage for user preferences
- Hosting: Backend on Vercel/Netlify, extension via developer mode
- ESPN content detection: URL pattern matching (/nba/boxscore/_/gameId/*)
- Page content analysis to extract team names for Wikipedia search
- **No shared dependencies** with existing PonteAI app

## Questions for User
1. ✅ Avatar appearance: Generic sports commentator look
2. ✅ Avatar position: Top-right corner of the page
3. How should we handle cases where Wikipedia doesn't have relevant information?
4. ✅ Timeline: 1 week development cycle, prioritize shipping quickly
5. Do you have preferences for the avatar's personality/voice?
6. Should we integrate with other sports sites beyond ESPN in the future?
7. How do you want to handle monetization in the future?
8. ✅ Testing example: ESPN NBA boxscore pages with gameId pattern (e.g., https://www.espn.com/nba/boxscore/_/gameId/401705278)
