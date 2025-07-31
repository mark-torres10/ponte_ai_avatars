# Enhanced Request Form UI + Demo Avatar Selection - Brain Dump

## Project Context
- **Existing Frontend**: Next.js production MVP with basic request intake form (`src/app/request-talent/page.tsx`)
- **Goal**: Enhance request form with multi-step wizard, avatar selection, and premium upsell features
- **Team**: PonteAI Linear team
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS, ShadCN UI

## Core Functionality Requirements

### 1. Multi-Step Wizard Flow
- **Step 1**: Template Categories & Campaign Type (with multi-avatar premium teaser)
- **Step 2**: Avatar Selection (Terry Crews, Will Howard)
- **Step 3**: Basic Project Details (use case, tone, script)
- **Step 4**: Contact Information
- **Step 5**: AI-Powered Proposal Generation
- **Step 6**: Campaign Optimization (Optional - with A/B testing teaser)
- **Step 7**: Creative Direction (Premium - teased)
- **Step 8**: Review & Confirmation (with rush delivery and ongoing management upsells)

### 2. Premium Features Integration
- **Multi-Avatar Campaigns**: Teased in Step 1 as "Coming Soon"
- **Premium Creative Direction**: Step 7 with brand customization upsell
- **A/B Testing Suite**: Step 6 with beta signup teaser
- **Rush Delivery**: Step 8 with 24-48 hour turnaround option
- **Ongoing Campaign Management**: Step 8 with monthly retainer options

### 3. Avatar Selection
- **Available Avatars**: Terry Crews, Will Howard
- **Preview**: Voice sample placeholder
- **Industry Recommendations**: Context-aware suggestions
- **UI**: Gallery-style selection with preview

### 4. AI-Powered Proposal Generation
- **Button**: "Get Your Custom AI-Powered Quote"
- **Output**: Campaign overview, multiple script variations
- **Editing**: Add/remove/modify scripts
- **Premium**: Advanced AI recommendations (teased)

### 5. Script Templates & Examples
- **Categories**: Product Demos, Training Videos, Marketing Campaigns, Social Media, Educational Content
- **Industry Templates**: Finance, Education, Sports, Gaming, Healthcare, E-commerce, B2B
- **Examples**: Pre-built scripts for each category with customization options

## Technical Considerations

### APIs to Integrate
- **OpenAI**: For AI proposal generation and script customization
- **Existing Backend**: Integration with current API endpoints
- **Future**: Supabase integration for database storage

### UI/UX Requirements
- **Responsive**: Works on all devices
- **Progress Tracking**: Clear step indicators
- **Form Persistence**: Secure session-based recovery with privacy compliance
- **Premium Teasers**: Strategic placement of upsell opportunities
- **Accessibility**: WCAG 2.1 AA compliance

### Code Organization
- **Components**: Modular wizard steps, premium feature modals
- **State Management**: Complex form state across multiple steps
- **Premium Features**: Clear separation of premium vs. standard features
- **Upsell Tracking**: Analytics for premium feature engagement

### Database Schema (Supabase-Ready)
- **Requests Table**: Core request data with premium features JSONB
- **Clients Table**: User/client information
- **Avatars Table**: Available avatars and metadata
- **Premium Features**: Structured data for upsell tracking

### Privacy and Compliance Requirements
- **Data Minimization**: Only collect necessary PII for form completion
- **User Consent**: Explicit consent for data collection and processing
- **Data Retention**: 
  - PII: Maximum 24 hours for abandoned forms, immediate deletion upon completion
  - Non-PII: 30 days maximum retention
  - Session data: 24-hour expiration
- **Right to Deletion**: Immediate data deletion upon user request
- **Data Portability**: Export user data in standard format
- **Security Measures**: 
  - Encrypted data transmission (HTTPS)
  - Secure session management
  - No PII stored in client-side storage
- **Compliance Frameworks**: GDPR, CCPA, and similar privacy regulations
- **Audit Trail**: Log data access and modifications for compliance

## Implementation Details

### Premium Features Strategy
- **Progressive Disclosure**: Start simple, reveal premium options gradually
- **Value Demonstration**: Show ROI and benefits clearly
- **Social Proof**: "Other companies see 40% better results"
- **Risk Reversal**: "Try premium features risk-free for 30 days"

### Upsell Placement
- **Step 1**: Multi-avatar campaigns (coming soon)
- **Step 3**: Advanced script customization (teased)
- **Step 5**: Advanced AI recommendations (teased)
- **Step 6**: A/B testing suite (coming soon)
- **Step 7**: Premium creative direction (full upsell)
- **Step 8**: Rush delivery and ongoing management (final upsells)

### Form Persistence
- **Secure Storage Strategy**: Avoid storing PII in localStorage
- **Non-Sensitive Data**: Store only form progress, step completion, and non-PII preferences
- **Session Storage**: Use sessionStorage for temporary form state during active session
- **Server-Side Persistence**: Store sensitive data (contact info, business details) server-side with secure session tokens
- **Data Retention Policy**: 
  - Non-PII data: 30 days maximum retention
  - PII data: Immediate deletion upon form completion or 24 hours after abandonment
  - Session tokens: 24-hour expiration with automatic cleanup
- **Privacy Compliance**: GDPR/CCPA compliant with explicit user consent and data minimization
- **Recovery**: Resume from last completed step using secure session-based approach

### Success Metrics
- **Completion Rate**: 70% target for full flow
- **Premium Adoption**: 25% target for premium features
- **Revenue Impact**: 40% increase in average order value
- **User Satisfaction**: 4.5/5 rating target

## Future Considerations
- **Supabase Integration**: Full database implementation
- **Advanced Analytics**: Premium feature performance tracking
- **A/B Testing**: Platform for testing different upsell strategies
- **Multi-Avatar Support**: Full implementation of teased features
- **Internationalization**: Multi-language support (currently English only)

## Code Notes for Premium Features
```typescript
// TODO: Premium feature - multi-avatar campaigns
// TODO: Premium feature - brand customization upsell
// TODO: Rush delivery upsell - 24-48 hour service
// TODO: Premium feature - A/B testing suite
// TODO: Premium feature - ongoing campaign management
```
