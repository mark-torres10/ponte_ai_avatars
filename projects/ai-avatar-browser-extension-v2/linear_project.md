# Linear Project: AI Avatar Browser Extension V2

## Project Title
AI Avatar Browser Extension V2 - Interactive Sports Commentary

## Problem Statement
Sports fans need more engaging and interactive UI experiences when consuming sports content. The current AI Avatar Browser Extension provides basic contextual information, but users need a comprehensive UI framework that allows them to interact with Parker, the AI sports commentator, in multiple ways - from debates and predictions to real-time game commentary. This project focuses on building the UI foundation with detailed visual states and real-time voice interactions powered by OpenAI's Realtime API.

## Objectives
1. **Enhanced UI Interactivity**: Implement 6 distinct UI modes with detailed visual states
2. **Visual Consistency**: Maintain consistent design language across all features using shadcn-ui
3. **Interactive Elements**: Create engaging UI components with proper state management
4. **User Experience**: Build intuitive navigation and smooth transitions between modes
5. **Technical Performance**: Ensure smooth UI operation without browser impact
6. **Real-time Voice Integration**: Implement OpenAI Realtime API for live voice interactions

## Success Criteria
- **UI Completeness**: All 6 modes implemented with exact visual match to provided screenshots
- **Interactive Elements**: All buttons, toggles, and input fields function correctly with proper visual states
- **Visual Consistency**: Clean, modern design using shadcn-ui components throughout
- **Real-time Voice**: Debate Mode and Hot Take Mode powered by OpenAI Realtime API
- **Performance**: Extension load time <200ms, voice response time <1s
- **Accessibility**: Full keyboard navigation and screen reader compatibility

## Scope

### In Scope
- **Core UI Framework**: Click avatar to reveal 6 feature icons in 2x3 grid with hover effects
- **Debate Mode**: Interactive Q&A interface with difficulty toggle (go easy vs go savage) and AI-powered responses
- **Hot Take Mode**: UI for displaying daily outrageous opinions with "SPICY" labels and AI-generated content
- **Predictive Mode**: Interface with confidence meter and mock prediction responses
- **NBA Recap Mode**: Tabbed interface for daily/team-specific recaps with mock content
- **Fan Take Reactions**: "Coming Soon" interface with mock instructional content
- **Game Companion Mode**: "Coming Soon" interface with mock live commentary description
- **Chrome Extension**: Manifest V3 with content script + popup UI (no background script needed)
- **FastAPI Backend**: Lightweight token service for OpenAI Realtime API authentication
- **API Integration**: OpenAI Realtime API for real-time voice interactions (ASR + LLM + TTS)
- **Railway Deployment**: Backend service deployment and API endpoint management

### Out of Scope
- Exa MCP and Wikipedia integrations
- Mobile browser support
- User authentication and personalization
- Social sharing features
- Multiple avatar personalities
- Advanced analytics and user tracking
- Monetization features
- Other sports beyond NBA
- Offline functionality

## Timeline
- **Duration**: 6 weeks
- **Start Date**: [To be determined]
- **End Date**: [To be determined]

## Team Composition
- **Frontend Developer**: UI/UX implementation, React components, mock data creation
- **Backend Developer**: FastAPI development, API integrations, Railway deployment
- **Extension Developer**: Chrome extension architecture, popup UI
- **QA Engineer**: Testing and validation

## Risk Mitigation

### Technical Risks
- **UI Complexity**: 6 different modes with detailed visual states might impact performance
  - *Mitigation*: Optimize component rendering and implement efficient state management
- **Chrome Extension Limitations**: Popup size and interaction constraints
  - *Mitigation*: Follow Chrome extension best practices and test across different screen sizes
- **API Integration Complexity**: OpenAI and ElevenLabs integrations might introduce latency
  - *Mitigation*: Implement proper error handling, caching, and fallback mechanisms
- **Backend Deployment**: Railway deployment and API endpoint management
  - *Mitigation*: Follow deployment best practices and implement comprehensive monitoring

### Product Risks
- **Feature Complexity**: 6 different modes might overwhelm users
  - *Mitigation*: Start with core modes, add complexity gradually
- **Mock Content Quality**: Static mock content might not demonstrate intended functionality effectively
  - *Mitigation*: Create comprehensive mock data that showcases each mode's potential

## Dependencies
- Chrome extension development environment
- React and TypeScript setup
- shadcn-ui component library
- Tailwind CSS configuration
- FastAPI and Python 3.10+ setup
- OpenAI API access and credentials
- Railway deployment platform
- Mock data creation and management

## Technical Architecture
```
Extension (client)
├── WebRTC connection to OpenAI Realtime API
├── Audio I/O: getUserMedia, WebRTC streaming
├── Token fetch: POST /v1/realtime/token → receives ephemeral client_secret
└── Manages ephemeral thread state; "Save transcript" writes to local IndexedDB

FastAPI (backend)
├── POST /v1/realtime/token → validates origin/auth
├── Calls OpenAI /v1/realtime/sessions with server key
└── Returns client_secret to browser (no audio processing)

OpenAI Realtime API
└── Handles ASR + LLM + TTS + turn-taking via WebRTC
```

## Implementation Phases
1. **Phase 1 (Week 1)**: ✅ Basic UI framework and feature navigation - **COMPLETED**
2. **Phase 2 (Week 2)**: FastAPI token service and Railway deployment
3. **Phase 3 (Week 3)**: Debate Mode and Hot Take Mode with Realtime API integration
4. **Phase 4 (Week 4)**: Predictive Mode and NBA Recap Mode UI implementation
5. **Phase 5 (Week 5)**: Fan Take Reactions and Game Companion Mode UI implementation
6. **Phase 6 (Week 6)**: Integration testing, optimization, and deployment

## Success Metrics
- **Primary**: UI completeness, visual consistency, user engagement, performance
- **Secondary**: Mock content quality, feature discovery, user retention, accessibility compliance

## Project Status
- **Current Phase**: Phase 1 Complete - Basic UI Framework Implemented
- **Completed**: Ticket-001 Basic UI Framework (✅ COMPLETED)
- **Next Steps**: Begin Phase 2 - FastAPI token service and Railway deployment
- **Blockers**: None identified

## Notes
- Building on existing V1 extension foundation
- Focus on UI consistency and visual design across all features
- Prioritize user experience and performance
- Use shadcn-ui for consistent component design
- Implement comprehensive mock data for all UI states
- OpenAI Realtime API integration for Debate Mode and Hot Take Mode functionality
- Implement comprehensive testing for all interactive features
- FastAPI backend provides secure token management for Realtime API access
