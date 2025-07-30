# Ponte AI Production App - Brain Dump

## Project Overview
Building a production Next.js app for Ponte AI (https://www.ponteai.com/) - a premium AI avatar marketplace.

## Core Requirements
- **Platform**: Next.js app deployed on Vercel
- **Routes**: 3 main routes + home page
  - `/` - Home page with "Welcome to Ponte AI" and "Get Started" button
  - `/request-talent` - Main functional page with carousel and intake form
  - `/onboard-client` - Stub page (same styling)
  - `/generate-avatar` - Stub page (same styling)

## Design Requirements
- **Brand Consistency**: Match styling and brand assets from https://www.ponteai.com/
- **Dark Theme**: Dark grey/black background with pink accents
- **Typography**: Clean, modern fonts
- **Components**: Rounded elements, subtle glows, consistent card design

## Request-Talent Page Flow
1. "Request Talent" header
2. Carousel of 5 example avatars (replicating the marketplace style)
3. Free-form intake form at bottom
4. Submit button (no backend functionality needed yet)

## Avatar Carousel Design
Based on the marketplace cards:
- Avatar image/video area
- Category tag (top-left, pink)
- Play button overlay (top-right)
- Name, rating, bookings, price range
- Service tags (2 per avatar)
- "Book Avatar" button

## Technical Stack
- **Framework**: Next.js 14+ (App Router)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS (for rapid development)
- **Icons**: Lucide React or similar
- **Components**: Custom components for consistency

## Questions to Address
1. Should we use actual avatar images or placeholders for the carousel?
2. What specific form fields should be in the intake form?
3. Do we need any animations or transitions?
4. Should the carousel be auto-scrolling or manual navigation?
5. What should the stub pages contain - just "Coming Soon" or more detailed placeholders?

## Constraints
- Frontend only for now (no backend functionality)
- Must deploy successfully to Vercel
- Should be production-ready in terms of code quality
- Follow expert frontend engineering practices

## Success Criteria
- Clean, professional Next.js app
- Consistent branding with Ponte AI website
- Responsive design
- Smooth user experience
- Ready for backend integration later

## Next Steps
1. Set up Next.js project structure
2. Create base styling system
3. Build home page
4. Build request-talent page with carousel
5. Create stub pages
6. Deploy to Vercel 