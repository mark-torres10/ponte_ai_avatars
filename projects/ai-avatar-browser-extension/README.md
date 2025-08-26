# AI Avatar Browser Extension

A Chrome browser extension that provides proactive AI commentary on ESPN NBA boxscore pages, demonstrating the potential of AI avatars as proactive assistants rather than reactive chatbots.

## Project Overview

This project represents a pivot in our AI avatar strategy - moving from reactive content generation to proactive, contextual assistance. The extension automatically detects when users visit ESPN NBA boxscore pages and provides real-time commentary about teams and game context.

## Key Features

- **Proactive Activation**: Automatically activates on ESPN NBA boxscore pages
- **AI Commentary**: Generates contextual information using OpenAI
- **Wikipedia Integration**: Provides relevant team background information
- **Audio Output**: Delivers commentary through ElevenLabs text-to-speech
- **Non-intrusive UI**: Avatar appears in top-right corner without disrupting page content

## Technical Architecture

```
Extension (Chrome)
├── Content Script (page detection, avatar display)
├── Background Script (API coordination)
└── Popup (basic settings)

Backend API
├── OpenAI integration
├── Wikipedia API integration
├── ElevenLabs integration
└── Rate limiting and caching
```

## Project Structure

```
projects/ai-avatar-browser-extension/
├── spec.md                    # Project specification
├── linear_project.md          # Linear project definition
├── plan_extension.md          # Task plan with phases
├── todo.md                    # Detailed task checklist
├── logs.md                    # Progress tracking logs
├── metrics.md                 # Performance metrics
├── lessons_learned.md         # Project insights
├── tickets/                   # Ticket documentation
│   └── tickets.md            # All project tickets
└── retrospective/             # Ticket retrospectives
    └── README.md             # Retrospective guide
```

## Linear Project

**Project**: [AI Avatar Browser Extension - Proactive Sports Commentary MVP](https://linear.app/metresearch/project/ai-avatar-browser-extension-proactive-sports-commentary-mvp-1efe1316af16)  
**Team**: PonteAI  
**Status**: Active Development

## Development Timeline

**Total Duration**: 1 week

- **Phase 1 (Days 1-2)**: Extension foundation and ESPN detection
- **Phase 2 (Days 3-4)**: Backend API and AI integration
- **Phase 3 (Days 5-6)**: Avatar UI and audio integration
- **Phase 4 (Day 7)**: Testing, refinement, and deployment

## Success Criteria

- Extension activates on 90%+ of ESPN NBA boxscore page visits
- Avatar provides relevant information 95%+ of the time
- Users listen to full commentary 80%+ of the time
- Page loading impact remains under 100ms
- Extension works without crashes for 99%+ of page visits

## Technical Requirements

- Chrome browser extension (developer mode)
- Node.js/Express backend
- OpenAI GPT-4 API
- Wikipedia API
- ElevenLabs streaming API
- TypeScript/React frontend

## Installation

### Developer Mode
1. Clone this repository
2. Navigate to the extension directory
3. Run `npm install` to install dependencies
4. Build the extension with `npm run build`
5. Load the extension in Chrome developer mode

### Backend Setup
1. Navigate to the backend directory
2. Set up environment variables for API keys
3. Run `npm install` to install dependencies
4. Deploy to Vercel/Netlify

## Usage

1. Install the extension in Chrome developer mode
2. Visit any ESPN NBA boxscore page (e.g., `/nba/boxscore/_/gameId/*`)
3. The avatar will automatically appear in the top-right corner
4. Listen to AI-generated commentary about the teams and game context

## Testing

The extension is designed to work with ESPN NBA boxscore pages. Test URLs:
- Example: `https://www.espn.com/nba/boxscore/_/gameId/401705278`

## Future Enhancements

- Multiple sports coverage (NFL, MLB, etc.)
- User customization and preferences
- Interactive conversations with avatar
- Mobile app version
- Monetization features

## Contributing

This is an MVP project for internal evaluation. Future contributions will be considered based on project direction decisions.

## License

Internal project - not for public distribution.

---

**Project Status**: Planning Complete  
**Next Milestone**: Development Environment Setup  
**Timeline**: 1 week MVP development
