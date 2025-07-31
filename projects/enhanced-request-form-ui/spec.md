# Enhanced Request Form UI - Demo Avatar Selection

## Problem Definition

The current request intake form (`src/app/request-talent/page.tsx`) is basic and lacks sophisticated features for capturing detailed project requirements, upselling premium services, and providing AI-powered recommendations. Users need a more comprehensive flow that guides them through avatar selection, campaign planning, and optional premium features.

## Success Metrics

- **User Engagement**: 70% completion rate for multi-step form
- **Upsell Conversion**: 25% adoption of premium features
- **Time to Complete**: Average 5-7 minutes for full flow
- **User Satisfaction**: 4.5/5 rating for form experience
- **Revenue Impact**: 40% increase in average order value through upsells

## Scope Boundaries

### Core Features (Required)
- Multi-step wizard with progress tracking
- Avatar selection from existing demo avatars (Terry Crews, Will Howard)
- Enhanced form fields (use case, tone, script)
- Form persistence using localStorage
- AI-powered proposal generation
- Success confirmation page

### Premium Features (Upsell Opportunities)
- Multi-avatar campaigns (teased, not yet available)
- Premium creative direction and brand customization
- A/B testing suite (coming soon)
- Rush delivery (24-48 hour turnaround)
- Ongoing campaign management retainer

## UX Considerations

### Multi-Step Wizard Flow

#### Step 1: Template Categories & Campaign Type
- **Industry Selection**: Finance, Education, Sports, Gaming, Healthcare, E-commerce, B2B
- **Campaign Type**: Single avatar vs. Multi-avatar campaign
  - **Premium Feature**: Multi-avatar campaigns (teased with "Coming Soon" badge)
  - **Upsell Message**: "Want to create campaigns with multiple avatars? Our premium multi-avatar campaigns are coming soon!"

#### Step 2: Avatar Selection
- Browse existing demo avatars (Terry Crews, Will Howard)
- Avatar preview with voice sample placeholder
- Industry-specific avatar recommendations

#### Step 3: Basic Project Details
- Use case selection with script templates
- Tone presets (casual, friendly, confident, professional, energetic)
- Script input with AI-powered suggestions
- **Premium Feature**: Advanced script customization (teased)

#### Step 4: Contact Information
- Name, email, company
- Project timeline preferences

#### Step 5: AI-Powered Proposal Generation
- **"Get Your Custom AI-Powered Quote"** button
- AI-generated campaign overview
- Multiple script variations
- Edit/add/remove capabilities
- **Premium Feature**: Advanced AI recommendations (teased)

#### Step 6: Campaign Optimization (Optional)
- Campaign type, target audience, timing, scope
- Channel selection (in-app, social, email, etc.)
- Personalization level
- Call-to-action options
- **Premium Feature**: A/B Testing Suite
  - **Upsell Message**: "Coming soon: A/B test different avatars and scripts to optimize performance. Join our beta program for early access!"

#### Step 7: Creative Direction (Premium - Teased)
- **Premium Feature**: Brand voice customization
- **Upsell Message**: "Want your avatar to perfectly match your brand? Our premium creative direction service includes brand voice customization, visual style matching, and competitive differentiation."
- Visual style preferences
- Competitive differentiation
- Tone consistency requirements
- **Code Note**: `// TODO: Premium feature - brand customization upsell`

#### Step 8: Review & Confirmation
- Final campaign overview
- **Premium Feature**: Rush Delivery
  - **Upsell Message**: "Need it faster? Our rush delivery service provides 24-48 hour turnaround for urgent projects."
  - **Code Note**: `// TODO: Rush delivery upsell - 24-48 hour service`
- **Premium Feature**: Ongoing Campaign Management
  - **Upsell Message**: "Love your avatar? Our ongoing campaign management includes monthly content creation, performance tracking, and optimization. Starting at $2,000/month."
- Submission with upsell tracking

### Premium Features Integration Strategy

#### 1. Multi-Avatar Campaigns (Step 1)
- **Placement**: Campaign type selection
- **Teaser**: "Coming Soon" badge with waitlist signup
- **Value Prop**: "Create campaigns with multiple avatars for different audience segments"
- **Future Upsell**: 2-3x base price

#### 2. Premium Creative Direction (Step 7)
- **Placement**: Optional enhancement section
- **Teaser**: "Premium Feature" badge
- **Value Prop**: "Perfect brand alignment and competitive differentiation"
- **Upsell**: $500-1000 additional

#### 3. A/B Testing Suite (Step 6)
- **Placement**: Campaign optimization section
- **Teaser**: "Coming Soon" with beta signup
- **Value Prop**: "Optimize performance with data-driven insights"
- **Future Upsell**: $300-500 additional

#### 4. Rush Delivery (Step 8)
- **Placement**: Final review and confirmation
- **Teaser**: "Rush Delivery" option
- **Value Prop**: "24-48 hour turnaround for urgent projects"
- **Upsell**: 50-100% premium

#### 5. Ongoing Campaign Management (Step 8)
- **Placement**: Final review with retainer options
- **Teaser**: "Ongoing Management" option
- **Value Prop**: "Monthly content creation and optimization"
- **Upsell**: $2000-5000/month retainer

## Technical Architecture

### Frontend Components
- Multi-step wizard with progress indicator
- Avatar selection gallery
- Form components with validation
- AI proposal generation interface
- Premium feature teasers and upsell modals
- localStorage integration for form persistence

### Backend Integration
- Existing API endpoints for avatar data
- New routes for form submission
- AI integration for proposal generation
- Supabase-ready database schema

### Database Schema (Supabase)
```sql
-- Request records
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  avatar_id UUID REFERENCES avatars(id),
  use_case TEXT NOT NULL,
  tone TEXT NOT NULL,
  script TEXT NOT NULL,
  campaign_type TEXT,
  target_audience TEXT,
  channels TEXT[],
  call_to_action TEXT,
  premium_features JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Client records
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Avatar records
CREATE TABLE avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  voice_sample_url TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Script Templates and Examples

#### Product Demos
**Template**: "Hi, I'm [Avatar Name]. Today I'm excited to show you [Product Name], the solution that [Key Benefit]. Watch how easy it is to [Main Feature]..."

**Example**: "Hi, I'm Terry Crews. Today I'm excited to show you FitFlow, the fitness app that transforms your workout routine. Watch how easy it is to track your progress and stay motivated..."

#### Training Videos
**Template**: "Welcome to [Training Topic]. I'm [Avatar Name], and I'll be your guide through this essential training. By the end of this session, you'll be able to [Learning Objective]..."

**Example**: "Welcome to Customer Service Excellence. I'm Will Howard, and I'll be your guide through this essential training. By the end of this session, you'll be able to handle difficult customer interactions with confidence..."

#### Marketing Campaigns
**Template**: "Attention [Target Audience]! [Avatar Name] here with an exclusive offer you won't want to miss. [Product/Service] is now available at [Special Price/Offer]..."

**Example**: "Attention sports fans! Terry Crews here with an exclusive offer you won't want to miss. FanDuel's new betting platform is now available with a $5 bet, $150 bonus deal..."

#### Social Media Content
**Template**: "Quick tip from [Avatar Name]: [Actionable Advice]. This simple strategy can [Benefit]. Try it today and let me know how it works for you!"

**Example**: "Quick tip from Will Howard: Start your day with a 10-minute planning session. This simple strategy can boost your productivity by 40%. Try it today and let me know how it works for you!"

#### Educational Content
**Template**: "Today we're exploring [Topic]. I'm [Avatar Name], and I'm here to break down [Complex Concept] into simple, actionable steps. Let's dive in..."

**Example**: "Today we're exploring blockchain technology. I'm Terry Crews, and I'm here to break down this complex technology into simple, actionable steps. Let's dive in..."

### Premium Features Implementation

#### Multi-Avatar Campaigns
```typescript
// TODO: Premium feature - multi-avatar campaigns
interface MultiAvatarCampaign {
  primaryAvatar: Avatar;
  secondaryAvatars: Avatar[];
  audienceSegments: AudienceSegment[];
  isPremium: boolean;
}
```

#### Creative Direction
```typescript
// TODO: Premium feature - brand customization upsell
interface CreativeDirection {
  brandVoice: string;
  visualStyle: 'casual' | 'professional' | 'energetic';
  competitiveDifferentiation: string;
  toneConsistency: string;
  isPremium: boolean;
}
```

#### Rush Delivery
```typescript
// TODO: Rush delivery upsell - 24-48 hour service
interface DeliveryOptions {
  standard: '3-5 business days';
  rush: '24-48 hours';
  isRushSelected: boolean;
}
```

#### A/B Testing Suite
```typescript
// TODO: Premium feature - A/B testing suite
interface ABTestingSuite {
  scriptVariations: Script[];
  avatarVariations: Avatar[];
  performanceTracking: boolean;
  isPremium: boolean;
}
```

#### Ongoing Campaign Management
```typescript
// TODO: Premium feature - ongoing campaign management
interface OngoingManagement {
  monthlyContent: boolean;
  performanceTracking: boolean;
  optimizationServices: boolean;
  retainerAmount: number;
  isPremium: boolean;
}
```

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Multi-step wizard framework
- Avatar selection component
- Basic form fields and validation
- localStorage persistence

### Phase 2: Core Features (Week 3-4)
- AI proposal generation
- Script templates and examples
- Form submission and backend integration
- Success confirmation page

### Phase 3: Premium Features (Week 5-6)
- Premium feature teasers and badges
- Upsell modal implementations
- Creative direction form (premium)
- Rush delivery options

### Phase 4: Optimization (Week 7-8)
- A/B testing suite teaser
- Ongoing campaign management options
- Performance tracking and analytics
- User feedback integration

## Success Criteria

1. **Functional Requirements**
   - Multi-step form with 100% completion capability
   - Avatar selection with preview functionality
   - AI-powered proposal generation
   - Form persistence across browser sessions
   - Premium feature teasers and upsells

2. **Performance Requirements**
   - Form loads in <2 seconds
   - AI proposal generation in <10 seconds
   - Responsive design for all screen sizes
   - WCAG 2.1 AA accessibility compliance

3. **Business Requirements**
   - 25% premium feature adoption rate
   - 40% increase in average order value
   - 70% form completion rate
   - Positive user feedback (4.5/5 rating)

## Risk Mitigation

- **Technical Risks**: AI integration complexity, form state management
- **Business Risks**: Premium feature adoption, user experience friction
- **Timeline Risks**: Development complexity, testing requirements

## Next Steps

1. Create Linear project and tickets
2. Set up development environment
3. Begin Phase 1 implementation
4. Regular progress reviews and adjustments 