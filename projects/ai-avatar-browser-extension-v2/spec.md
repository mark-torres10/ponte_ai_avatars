# AI Avatar Browser Extension V2 - Project Specification

## 1. Problem Definition and Stakeholder Identification

### Problem Statement
Sports fans want more engaging and interactive experiences when consuming sports content. The current AI Avatar Browser Extension provides basic contextual information, but users need dynamic, interactive features that allow them to engage with Parker, the AI sports commentator, in multiple ways - from debates and predictions to real-time game commentary.

### Stakeholders
- **Primary Users**: Sports fans who want interactive AI commentary and engagement
- **Secondary Users**: Casual sports viewers seeking entertainment and insights
- **Business Stakeholders**: PonteAI team expanding product capabilities
- **Technical Stakeholders**: Development team building enhanced extension features

### Current Pain Points
- Limited interaction with AI avatar beyond passive listening
- No personalized sports content based on user preferences
- Missing real-time engagement during live games
- Lack of diverse content formats (debates, predictions, reactions)
- No way to engage with community content (Reddit comments, fan takes)

## 2. Success Metrics and Validation Criteria

### Primary Success Metrics
- **UI Completeness**: All 6 modes implemented with exact visual match to provided screenshots
- **Visual Consistency**: Clean, modern design using shadcn-ui components throughout
- **Interactive Elements**: All buttons, toggles, and input fields function correctly with proper visual states
- **Performance**: Extension load time <200ms, no impact on ESPN page performance
- **Mock Content Quality**: All modes display appropriate mock content demonstrating intended functionality

### Secondary Success Metrics
- **Feature Discovery**: 80%+ of users discover and try all 6 modes
- **User Retention**: 60%+ of users return within 7 days
- **Accessibility**: Full keyboard navigation and screen reader compatibility
- **Smooth Navigation**: Intuitive flow between modes with proper state management

### Validation Criteria
- All 6 interactive modes function without errors
- UI interactions are smooth and responsive
- Mock content displays correctly in all modes
- Visual design matches provided screenshots exactly
- Extension doesn't interfere with ESPN functionality
- All accessibility requirements are met

## 3. Scope Boundaries and Technical Requirements

### In Scope (MVP)
- **Core UI Framework**: Click avatar to reveal 6 feature icons in 2x3 grid with hover effects
- **Debate Mode**: Interactive interface with difficulty toggle (go easy vs go savage) and AI-powered responses
- **Hot Take Mode**: Interface for displaying daily outrageous opinions with "SPICY" labels and AI-generated content
- **Predictive Mode UI**: Interface with confidence meter and mock prediction responses
- **NBA Recap Mode UI**: Tabbed interface for daily/team-specific recaps with mock content
- **Fan Take Reactions UI**: "Coming Soon" interface with mock instructional content
- **Game Companion Mode UI**: "Coming Soon" interface with mock live commentary description
- **Chrome Extension**: Manifest V3 with content script + popup UI (no background script needed)
- **FastAPI Backend**: Lightweight token service for OpenAI Realtime API authentication
- **API Integration**: OpenAI Realtime API for real-time voice interactions (ASR + LLM + TTS)
- **Railway Deployment**: Backend service deployment and API endpoint management

### Out of Scope (Future Enhancements)
- Exa MCP and Wikipedia integrations
- Mobile browser support
- User authentication and personalization
- Social sharing features
- Multiple avatar personalities
- Advanced analytics and user tracking
- Monetization features
- Other sports beyond NBA
- Offline functionality

### Technical Requirements
- **Extension Architecture**: Content script + popup UI (no background script needed)
- **UI Framework**: React, TypeScript, shadcn-ui, Tailwind CSS
- **Backend Framework**: FastAPI with Python 3.10+ (token service only)
- **API Integration**: OpenAI Realtime API for real-time voice interactions
- **Deployment**: Railway platform for backend service
- **Audio Processing**: WebRTC direct connection to OpenAI Realtime API
- **Performance**: <200ms extension load time, <1s voice response time
- **Security**: API key management, CORS configuration, minimal permissions
- **Compatibility**: Chrome 90+, modern JavaScript features, WebRTC support
- **UI Components**: Reusable shadcn-ui components with custom styling

## 4. User Experience Considerations

### User Flow
1. User installs extension and visits ESPN
2. Avatar icon appears in browser toolbar
3. User clicks avatar to reveal main popup interface (400x600px)
4. User sees 6 feature icons in 2x3 grid with hover effects
5. User selects desired mode (debate, hot take, predictions, etc.)
6. User interacts with Parker through text input and UI controls
7. Parker responds with mock content displayed in the interface
8. User can switch between modes or close interface

### User Interface Design
- **Main Interface**: Clean 2x3 grid layout with 6 feature icons
- **Feature Icons**: Lightning (debate), Fire (hot take), Crystal ball (predictions), Question mark (NBA recap), Comment bubble (fan reactions), Wi-Fi/radiating waves (game companion)
- **Hover Effects**: Feature names appear on hover with smooth transitions
- **Mode Interfaces**: Context-appropriate UI for each feature with mock content
- **Interactive Elements**: Buttons, toggles, input fields, progress indicators, "Coming Soon" states
- **Visual Style**: Modern, clean, sports-themed with shadcn-ui components

### Accessibility Considerations
- Keyboard navigation for all interactive elements
- Screen reader compatible content
- High contrast mode support
- Clear visual feedback for all actions
- Focus management for modal interfaces

## 5. Technical Feasibility and Estimation

### Technical Architecture
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

### Implementation Phases
1. **Phase 1 (Week 1)**: Basic UI framework and feature navigation
2. **Phase 2 (Week 2)**: FastAPI token service and Railway deployment
3. **Phase 3 (Week 3)**: Debate Mode and Hot Take Mode with Realtime API integration
4. **Phase 4 (Week 4)**: Predictive Mode and NBA Recap Mode UI implementation
5. **Phase 5 (Week 5)**: Fan Take Reactions and Game Companion Mode UI implementation
6. **Phase 6 (Week 6)**: Integration testing, optimization, and deployment

### Risk Assessment
- **Low Risk**: UI framework, basic extension structure, mock data
- **Medium Risk**: Complex UI interactions, state management, WebRTC integration
- **High Risk**: Performance optimization, accessibility compliance, Realtime API integration

### Dependencies
- Chrome extension development environment
- React and TypeScript setup
- shadcn-ui component library
- Tailwind CSS configuration
- FastAPI and Python 3.10+ setup
- OpenAI API access and credentials
- Railway deployment platform
- Mock data creation and management

## 6. OpenAI Realtime API Integration

### 6.1 Realtime API Overview
The OpenAI Realtime API provides a unified solution for real-time voice interactions, combining ASR (Automatic Speech Recognition), LLM (Large Language Model), and TTS (Text-to-Speech) in a single WebRTC-based service. This eliminates the need for separate API calls and reduces latency significantly.

### 6.2 Key Features
- **Speech-to-Speech Model**: Direct audio processing without intermediate text conversion
- **WebRTC Integration**: Low-latency, real-time audio streaming
- **Turn-taking**: Built-in conversation flow management
- **Barge-in Support**: Users can interrupt Parker's responses
- **Multiple Voices**: Built-in voice options (e.g., "verse", "cedar", "marin")
- **Ephemeral Tokens**: Secure, short-lived authentication tokens

### 6.3 Technical Implementation
- **Token Service**: FastAPI backend mints ephemeral `client_secret` tokens
- **WebRTC Connection**: Direct browser-to-OpenAI connection
- **Audio Formats**: PCM16, G.711 μ-law, G.711 A-law support
- **Session Management**: Stateful conversations with configurable parameters
- **Performance**: Sub-second response times for voice interactions

### 6.4 API Endpoints
- **Backend**: `POST /v1/realtime/token` - Generate ephemeral tokens
- **OpenAI**: `POST /v1/realtime/sessions` - Create Realtime API sessions
- **WebRTC**: Direct peer-to-peer connection for audio streaming

### 6.5 Security & Privacy
- **No Audio Storage**: Audio is processed in real-time, not stored
- **Ephemeral Tokens**: Short-lived authentication (10-minute default)
- **Origin Validation**: CORS protection for browser extension requests
- **Rate Limiting**: Prevents token abuse and API overuse

## 7. Feature Specifications

### 7.1 Basic UI Framework
- **Avatar Icon**: Clickable icon in browser toolbar (initial state)
- **Main Interface**: Popup/modal that appears when avatar is clicked
- **Feature Grid**: 2x3 grid layout of feature icons with hover effects
- **Feature Icons**: Lightning (debate), Fire (hot take), Crystal ball (predictions), Question mark (NBA recap), Comment bubble (fan reactions), Game controller (companion)
- **Hover Effects**: Feature names appear on hover with smooth transitions
- **Navigation**: Easy switching between modes with back button
- **Responsive Design**: Works on different screen sizes

### 7.2 Debate Mode UI
- **Trigger**: Lightning icon in header, highlighted when active
- **Hover Effect**: "Quick Voice (Spacebar)" tooltip appears when hovering over lightning icon
- **Main Content**: "Debate Mode" title with question mark help icon
- **Voice Input Interface**: Large light blue-gray interaction box containing:
  - Microphone icon and "Tap or press Spacebar to ask Parker" text
  - Large circular black button with white microphone icon
  - Visual feedback (pulsating ring) when spacebar is pressed
- **Difficulty Toggle**: Two horizontal buttons below interaction box:
  - "Go Easy" and "Go Savage" with light gray background when selected
  - Only one button highlighted at a time
- **Text Input Option**: Keyboard icon with "Or type your question" text
- **Response Display**: Gray "Parker" response box at bottom with mock content
- **Mock Content**: Pre-written debate responses (e.g., "I respect Giannis, but pure dominance means consistent championships. Where's the consistency?")

### 7.3 Hot Take Mode UI
- **Trigger**: Fire icon in header, highlighted when active
- **Hover Effect**: "Hot Take" tooltip appears when hovering over fire icon
- **Main Content**: "Hot Take" title with question mark help icon
- **Description Bubble**: Dark, rounded rectangular bubble with text "Parker's most outrageous daily opinion with zero filter"
- **Hot Take Card**: Distinct card with light pink/red background and darker pink/red border
- **SPICY Label**: Small flame icon and "SPICY" label (white text on red, rounded background) in top-left corner
- **Content Display**: Mock hot take text in bold, italicized font
- **Mock Content**: Pre-written controversial sports opinions (e.g., "I don't wanna hear another WORD about the Lakers until they WIN something! Three years of 'championship aspirations' and NOTHING to show for it!")

### 7.4 Predictive Mode UI
- **Trigger**: Crystal ball icon with hover effect showing "Predictions Mode"
- **Input Interface**: Text field for game prediction questions
- **Response Display**: Text area showing bold predictions with dramatic flair
- **Confidence Meter**: Visual progress bar or percentage showing Parker's certainty
- **Game Input**: Specific field for typing game names
- **Audio Trigger**: Button to trigger audio with confidence display
- **Mock Content**: Pre-written predictions with varying confidence levels

### 7.5 NBA Recap Mode UI
- **Trigger**: Question mark icon in header, highlighted when active
- **Hover Effect**: "NBA Recap" tooltip appears when hovering over question mark icon
- **Main Content**: "NBA Recap" title with question mark help icon
- **Mode Selection Tabs**: Two tab-like buttons: "Daily Recap" (default selected) and "Your Teams"
- **Orange Card**: Large, light orange-beige rectangular card below the tabs
- **Daily Recap State**: Card displays basketball icon, "Tap or press Spacebar for recap" text, and large black circular play button
- **Your Teams State**: Card displays small orange play icon, "YOUR TEAMS" text, mock recap content with bold/italicized words, and "Parker's Last Night Rundown" with question mark icons
- **Visual Design**: Clean, tabbed interface with distinct orange-themed card
- **Mock Content**: Pre-written recap content for demonstration (e.g., Warriors/Lakers game summary)

### 7.6 Fan Take Reactions UI
- **Trigger**: Comment bubble icon (filled) in header's 2x3 grid, highlighted when active
- **Main Content**: "Fan Take Reactions" title with question mark help icon
- **"COMING SOON" Banner**: Light purple-pink rectangular box with rounded corners, containing white, bold, uppercase "COMING SOON" text
- **Interaction Area**: Larger light purple-pink rectangular area with rounded corners
- **Icons**: Centered purple microphone and outlined speech bubble icons within the interaction area
- **"COMING SOON" Button**: Light gray, rounded rectangular button with white, bold, uppercase "COMING SOON" text
- **Instructional Text**: "Read fan comments aloud or paste them - Parker will deliver his most **BRUTAL** voice reactions yet!"
- **Example Quote**: Purple, italicized text: "This is RIDICULOUS! ABSURD!"
- **Visual Design**: Clean, modern layout with consistent light purple-pink theme

### 7.7 Game Companion Mode UI
- **Trigger**: Wi-Fi/radiating waves icon in header, highlighted when active
- **Hover Effect**: "Game Companion Mode" tooltip appears when hovering over Wi-Fi/radiating waves icon
- **Main Content**: "Game Companion" title with question mark help icon
- **Content Box**: Large, light green-bordered rectangular box
- **Inside Content Box**: Green Wi-Fi/radiating waves icon and green microphone icon
- **Status Indicator**: Prominent "COMING SOON" button
- **Description**: Text: "Parker will interrupt with live voice commentary during games - quarter analysis, halftime takes, and clutch moments!"
- **Live Indicator**: Red bullet point followed by green, italicized text: "LIVE VOICE FROM COURTSIDE"
- **Mock Content**: Static text for description and "Coming Soon" status
- **State Management**: Simulated live game states

## 8. Success Criteria Summary

A successful V2 UI will demonstrate:
1. **Enhanced Interactivity**: Users can navigate through 6 different UI modes seamlessly
2. **Visual Consistency**: Clean, modern design using shadcn-ui components throughout
3. **Smooth Navigation**: Intuitive flow between modes with proper state management
4. **User Engagement**: Interactive elements that respond appropriately to user input
5. **Technical Performance**: Smooth animations and transitions without impacting browser performance
6. **Content Display**: Mock content that demonstrates the intended functionality of each mode
7. **Screenshot Accuracy**: All UI elements match the provided screenshots exactly
8. **Accessibility**: Full keyboard navigation and screen reader compatibility

This specification provides a comprehensive roadmap for building the UI framework for an enhanced AI Avatar Browser Extension that will serve as the foundation for future API integrations.
