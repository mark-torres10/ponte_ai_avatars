# Ponte AI - AI Avatar Marketplace

A professional Next.js application for Ponte AI's AI avatar marketplace, designed to replace their manual email-based booking process with a streamlined web interface for client demos and fundraising.

## 🚀 Features

### ✅ Implemented Features
- **Next.js 14+ with App Router** - Modern React framework with latest features
- **Ponte AI Brand Styling** - Dark theme with pink accents matching the official website
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **4 Main Routes**:
  - `/` - Home page with hero section and avatar showcase
  - `/request-talent` - Main functional page with avatar carousel and booking form
  - `/onboard-client` - Stub page for talent onboarding (coming soon)
  - `/generate-avatar` - Stub page for avatar generation demo (coming soon)

### 🎨 Design System
- **Brand Colors**: Extracted from Ponte AI website using Playwright MCP
  - Primary Pink: `#DD3C61` (rgb(221, 60, 97))
  - Gradient Pink: `linear-gradient(135deg, #C2607D, #ED7CA3)`
  - Background: `#09090B` (Very dark gray/black)
  - Text: `#FAFAFA` (Off-white)
  - Borders: `#27272A` (Dark gray)
- **Typography**: Inter font family
- **Components**: Custom CSS classes with Ponte AI branding
- **Animations**: Smooth transitions and hover effects

### 🔧 Technical Stack
- **Frontend**: Next.js 15.4.5 with App Router
- **Backend**: Express.js with TypeScript, deployed on Railway
- **Styling**: Tailwind CSS v3 with custom brand configuration
- **Language**: TypeScript for type safety
- **Linting**: ESLint with Next.js configuration
- **Build**: Optimized production build with static generation
- **Deployment**: Vercel (frontend) + Railway (backend)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Commands
```bash
npm run dev      # Start development server with hot reload
npm run build    # Create optimized production build
npm run start    # Start production server
npm run lint     # Run ESLint for code quality
```

## 🏗️ Project Structure

```
ponte_ai/
├── src/                         # Frontend Next.js application
│   ├── app/
│   │   ├── globals.css          # Global styles with Ponte AI branding
│   │   ├── layout.tsx           # Root layout with dark theme
│   │   ├── page.tsx             # Home page
│   │   ├── request-talent/      # Main booking page
│   │   ├── onboard-client/      # Talent onboarding stub
│   │   └── generate-avatar/     # Avatar demo stub
│   ├── components/
│   │   └── navigation.tsx       # Navigation component
│   └── lib/
│       └── utils.ts             # Utility functions
├── backend/                     # Backend Express.js API service
│   ├── src/
│   │   ├── app.ts              # Express app configuration
│   │   ├── index.ts            # Server entry point
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   ├── services/           # Business logic services
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   └── __tests__/          # Test files
│   ├── package.json            # Backend dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   └── README.md               # Backend documentation
├── public/                      # Static assets
├── tailwind.config.js           # Tailwind config with brand colors
├── package.json                 # Frontend dependencies and scripts
├── projects/                    # Project management files
│   ├── ponte-ai-talent-hub/
│   │   ├── README.md            # Project documentation
│   │   ├── spec.md              # Project specification
│   │   └── tickets/             # Linear tickets
│   └── avatar-generation-demo/
│       ├── README.md            # Avatar demo documentation
│       ├── spec.md              # Avatar demo specification
│       └── tickets/             # Avatar demo tickets
└── README.md                    # This file
```

## 🎯 Key Features

### Home Page (`/`)
- Hero section with Ponte AI branding
- Avatar showcase with 5 sample avatars
- Features section for talent and brands
- Responsive grid layout
- Gradient text effects

### Request Talent Page (`/request-talent`)
- **Avatar Carousel**: Manual navigation through 5 avatars
- **Avatar Selection**: Click to select preferred avatar
- **Booking Form**: Comprehensive project requirements form
- **Form Validation**: Required fields and proper validation
- **Success Page**: Confirmation with request summary
- **Responsive Design**: Works on all device sizes

### Avatar Carousel Features
- Manual navigation (Previous/Next buttons)
- Avatar counter (e.g., "2 of 5")
- Detailed avatar information
- Selection state management
- Portrait-oriented card design

### Form Features
- **Required Fields**: Name, email, project type, budget, timeline, description
- **Optional Fields**: Company/organization
- **Dropdown Selections**: Project type, budget range, timeline
- **Text Areas**: Project description
- **Form Validation**: Client-side validation
- **Success Handling**: Confirmation page with summary

## 🎨 Brand Styling Validation

The application has been validated using Playwright MCP to ensure brand consistency with the Ponte AI website:

### ✅ Validated Elements
- **Background Colors**: Dark theme matching Ponte AI website
- **Text Colors**: Off-white text for readability
- **Primary Colors**: Pink accent colors extracted from website
- **Gradients**: Pink gradient effects for text and backgrounds
- **Layout Structure**: Navigation, hero sections, and content areas
- **Responsive Design**: Mobile, tablet, and desktop layouts

### 🧪 Testing Results
- **Build Success**: ✅ `npm run build` passes without errors
- **TypeScript**: ✅ All type checks pass
- **ESLint**: ✅ Code quality standards met
- **Responsive Design**: ✅ Works on all screen sizes
- **Form Functionality**: ✅ Complete form submission flow
- **Navigation**: ✅ All routes accessible and functional

## 🚀 Deployment Architecture

The application uses a modern full-stack deployment architecture:

### Frontend (Vercel)
- **Platform**: Vercel for Next.js hosting
- **Build Optimization**: Static generation for all pages
- **Performance**: Optimized bundle sizes and CDN delivery
- **SEO**: Proper metadata and title tags
- **Accessibility**: Semantic HTML and proper ARIA labels

### Backend (Railway)
- **Platform**: Railway for Express.js API hosting
- **Always-On**: No cold starts or execution time limits
- **Demo-Stable**: Perfect for client presentations and demos
- **Scalable**: Container-based deployment with automatic scaling
- **Security**: HTTPS, CORS, rate limiting, and security headers

### API Integration
- **Health Endpoints**: `/health` and `/health/detailed` for monitoring
- **CORS Configuration**: Frontend-backend communication enabled
- **Environment Variables**: Secure API key management
- **Error Handling**: Comprehensive error responses and logging

## 📋 Success Criteria Met

✅ **Next.js 14+ App Router**: Modern React framework implemented  
✅ **Tailwind CSS**: Custom brand theme with Ponte AI colors  
✅ **ShadCN Components**: Utility functions and component structure  
✅ **TypeScript**: Full type safety throughout the application  
✅ **ESLint**: Code quality and consistency  
✅ **4 Routes**: Home, request-talent, onboard-client, generate-avatar  
✅ **Avatar Carousel**: Manual navigation with 5 avatars  
✅ **Portrait Cards**: Taller-than-wide avatar display  
✅ **Form Submission**: Complete booking form with confirmation  
✅ **Brand Styling**: Matches Ponte AI website design  
✅ **Responsive Design**: Works on all device sizes  
✅ **Build Success**: `npm run build` passes without errors  
✅ **Playwright Validation**: Brand styling verified against website  

## 🔮 Current Development Status

### ✅ Completed
- **Frontend MVP**: Complete Next.js application with Ponte AI branding
- **Backend Foundation**: Express.js API service with TypeScript
- **Deployment Setup**: Vercel (frontend) + Railway (backend) architecture
- **API Structure**: Health endpoints, error handling, and security middleware

### 🚧 In Progress
- **Avatar Generation Demo**: PON-18 backend setup (in review)
- **API Integrations**: OpenAI, ElevenLabs, and D-ID integrations planned

### 🔮 Future Enhancements
- **Avatar Generation Pipeline**: Complete text, voice, and video generation
- **Database Integration**: Supabase for data persistence
- **Authentication**: User management and session handling
- **Payment Processing**: Stripe integration for avatar bookings
- **Email Notifications**: Automated email workflows
- **Analytics**: User behavior tracking and metrics

## 📞 Support & Documentation

### Project Documentation
- **Frontend**: See `src/` directory for Next.js application code
- **Backend**: See `backend/` directory for Express.js API service
- **Project Management**: See `projects/` directory for specifications and tickets

### Development Resources
- **Linear Project**: [Ponte AI - AI Avatar Marketplace](https://linear.app/metresearch/project/production-app-mvp-for-client-demos-and-fundraising-8ade99e55da3)
- **Avatar Demo Project**: [Avatar Generation Demo Implementation](https://linear.app/metresearch/project/avatar-generation-demo-implementation-62ab6967b5e8)
- **Backend API**: Railway deployment with health endpoints
- **Frontend**: Vercel deployment with Ponte AI branding

### Contact
For questions or issues with the Ponte AI - AI Avatar Marketplace, please refer to the project documentation or contact the development team.

---

**Built with ❤️ for Ponte AI**
