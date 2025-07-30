# Ponte AI Production App MVP

**Linear Project:** [Production App MVP for Client Demos and Fundraising](https://linear.app/metresearch/project/production-app-mvp-for-client-demos-and-fundraising-8ade99e55da3)

## Project Overview
Building a production Next.js app for Ponte AI to replace the manual email-based avatar booking process and enable client demonstrations for fundraising.

## Problem Statement
Ponte AI currently has a manual, email-based process for clients to book AI avatars, which creates friction and inefficiency. The internal team needs a professional frontend application to demonstrate to potential investors and clients, enabling them to raise funding and showcase their platform capabilities.

## Success Criteria
- Deployed Vercel app accessible to stakeholders
- Professional, brand-consistent interface matching Ponte AI website
- Functional request-talent flow with avatar selection and form submission
- Non-technical stakeholders can successfully navigate and use the app
- Ready for client demonstrations and fundraising presentations

## Tickets

### Foundation (Must be done first)
- **PON-12**: [Set up Next.js project foundation and brand styling system](https://linear.app/metresearch/issue/PON-12/set-up-nextjs-project-foundation-and-brand-styling-system)

### Can be done in parallel after PON-12:
- **PON-13**: [Build home page with navigation and "Get Started" flow](https://linear.app/metresearch/issue/PON-13/build-home-page-with-navigation-and-get-started-flow)
- **PON-14**: [Create avatar carousel component with portrait orientation](https://linear.app/metresearch/issue/PON-14/create-avatar-carousel-component-with-portrait-orientation)
- **PON-16**: [Create stub pages for onboard-client and generate-avatar](https://linear.app/metresearch/issue/PON-16/create-stub-pages-for-onboard-client-and-generate-avatar)

### Must be done after PON-14:
- **PON-15**: [Build request-talent page with form and submission flow](https://linear.app/metresearch/issue/PON-15/build-request-talent-page-with-form-and-submission-flow)

### Final step (requires all previous tickets):
- **PON-17**: [Deploy to Vercel and final testing](https://linear.app/metresearch/issue/PON-17/deploy-to-vercel-and-final-testing)

## Execution Order
1. **PON-12** (Foundation)
2. **PON-13, PON-14, PON-16** (Can be done in parallel)
3. **PON-15** (Requires PON-14)
4. **PON-17** (Final deployment)

## Key Requirements
- All tickets must pass `npm run build` locally
- All tickets must be validated using Playwright MCP
- Avatar carousel must have portrait orientation (taller than wide)
- Brand styling must match Ponte AI website exactly
- Professional appearance suitable for client demos and fundraising

## Timeline
- **Target completion**: Today
- **Total estimated effort**: 9.5 hours
- **Parallel execution opportunities**: 3 tickets can be worked on simultaneously after foundation

## Files
- `spec.md` - Complete project specification
- `tickets/` - Individual ticket documentation
- `README.md` - This project overview 