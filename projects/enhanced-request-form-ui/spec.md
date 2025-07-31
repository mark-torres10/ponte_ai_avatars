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

### Emotionally-Driven Multi-Step Wizard Flow

#### Step 1: "What's Your Vision?" 🌟
**Emotional Goal**: Create aspiration and desire
- **Visual Elements**: Video background showing successful campaigns, floating success metrics
- **Copy Strategy**: "Transform Your Brand with Celebrity AI Avatars"
- **Examples**: "See how FanDuel increased signups by 400% with Will Howard"
- **Interactive Elements**: Hover effects showing campaign results, "Try it now" buttons
- **Premium Feature**: Multi-avatar campaigns (teased with "Coming Soon" badge)
- **Upsell Message**: "Want to dominate multiple audience segments? Our premium multi-avatar campaigns are coming soon!"

#### Step 2: "Meet Your Perfect Match" 💫
**Emotional Goal**: Create personal connection and attachment
- **Visual Elements**: Video previews of avatars speaking, "Hear Terry Crews say your brand name" demo
- **Copy Strategy**: "Choose Your Brand's Perfect Voice"
- **Terry Crews**: "The voice of authority and trust. When Terry speaks, people listen."
- **Will Howard**: "The authentic sports connection. Will Howard connects with fans like no one else."
- **Interactive Elements**: Voice preview, personality quiz, video examples in action

#### Step 3: "Your Story, Their Voice" 📖
**Emotional Goal**: Make it personal and meaningful
- **Visual Elements**: Story-focused form design, brand story timeline
- **Copy Strategy**: "What Story Do You Want to Tell?"
- **Form Fields** (Emotionally Framed):
  - "Your Brand's Mission" (instead of "Company Name")
  - "The Story You Want to Tell" (instead of "Script")
  - "How You Want to Make People Feel" (instead of "Tone")
  - "The Action You Want Them to Take" (instead of "Call to Action")
- **Premium Feature**: Advanced script customization (teased)

#### Step 4: "See Your Future" 🔮
**Emotional Goal**: Create excitement and anticipation
- **Visual Elements**: AI-generated mockup of their specific campaign
- **Copy Strategy**: "Here's Your Campaign in Action"
- **Interactive Elements**: Real-time campaign preview, "See it on different platforms" toggle
- **Premium Feature**: Advanced AI recommendations (teased)

#### Step 5: "Your Success Story" 📈
**Emotional Goal**: Demonstrate value and create urgency
- **Visual Elements**: ROI calculator, success case studies, projected results dashboard
- **Copy Strategy**: "Here's What Success Looks Like for You"
- **Interactive Elements**: Dynamic ROI calculator, industry-specific success stories
- **Premium Feature**: A/B Testing Suite
  - **Upsell Message**: "Want even bigger results? A/B test different avatars and scripts to optimize performance."

#### Step 6: "Amplify Your Impact" 🚀
**Emotional Goal**: Create desire for premium features
- **Visual Elements**: "Want even bigger results?" section, premium feature previews
- **Copy Strategy**: "Want Even Bigger Results?"
- **Premium Features** (Framed as Success Amplifiers):
  - "Multi-Avatar Campaigns: Dominate multiple audience segments"
  - "A/B Testing Suite: Optimize for maximum impact"
  - "Creative Direction: Perfect brand alignment"
  - "Rush Delivery: Launch before your competitors"

#### Step 7: "Make It Perfect" ✨
**Emotional Goal**: Create desire for premium customization
- **Visual Elements**: Brand customization previews, "Perfect for your brand" mockups
- **Copy Strategy**: "Let's Make It Perfect for Your Brand"
- **Premium Feature**: Brand voice customization
- **Upsell Message**: "Want your avatar to perfectly match your brand? Our premium creative direction service includes brand voice customization, visual style matching, and competitive differentiation."
- **Code Note**: `// TODO: Premium feature - brand customization upsell`

#### Step 8: "Ready to Launch?" 🎯
**Emotional Goal**: Create urgency and excitement for final commitment
- **Visual Elements**: "Your campaign is ready" summary, launch countdown timer
- **Copy Strategy**: "Your Campaign is Ready to Launch"
- **Premium Feature**: Rush Delivery
  - **Upsell Message**: "Don't let your competitors get there first! Our rush delivery service provides 24-48 hour turnaround for urgent projects."
  - **Code Note**: `// TODO: Rush delivery upsell - 24-48 hour service`
- **Premium Feature**: Ongoing Campaign Management
  - **Upsell Message**: "Ready to dominate your market? Our ongoing campaign management includes monthly content creation, performance tracking, and optimization. Starting at $2,000/month."
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

## Pricing Strategy Integration

### Real-Time Proposal Generation
- **AI-Powered Analysis**: Real-time processing of form inputs
- **Industry-Specific Templates**: Dynamic script generation
- **Pricing Presentation**: Tiered options after proposal generation
- **Customization Options**: Add-on services and premium features

### Pricing Tiers
1. **Starter Success**: $997 (one-time) - Basic avatar with standard delivery
2. **Professional Power**: $1,997 (one-time) - AI optimization, rush delivery option
3. **Premium Domination**: $3,997 (one-time) - Creative direction, brand customization
4. **Campaign Commander**: $2,997/month - Ongoing management, multi-avatar campaigns
5. **Enterprise Empire**: $9,997/year - Unlimited access, enterprise support

### Premium Add-ons
- **Rush Delivery**: +$500 (24-48 hours)
- **Creative Direction**: +$1,000 (brand customization)
- **Multi-Avatar Campaign**: +$2,000 (multiple avatars)
- **A/B Testing Suite**: +$300 (performance optimization)

### Pricing Psychology
- **Anchoring**: Show premium first, then standard
- **Risk Reversal**: 30-day money-back guarantee
- **Urgency**: Limited-time offers and rush options
- **Social Proof**: Customer testimonials and case studies

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