# Ticket PON-16: Create stub pages for onboard-client and generate-avatar

**Linear Link:** https://linear.app/metresearch/issue/PON-16/create-stub-pages-for-onboard-client-and-generate-avatar

## Context & Motivation
Create placeholder pages for the remaining routes to complete the app structure and provide navigation consistency. These pages will have the same styling as the main pages but minimal functionality.

## Functional Requirements
- /onboard-client page with brand styling
- /generate-avatar page with brand styling
- Navigation consistency with other pages
- "Coming Soon" or placeholder content
- Responsive design

## Non-Functional Requirements
- Consistent navigation
- Responsive design
- Brand consistency

## Success Criteria
- Both stub pages render correctly
- Navigation works consistently
- Brand styling matches other pages
- Professional appearance maintained
- **Local build passes with `npm run build`**
- **Playwright MCP validates both stub pages render correctly**
- **Playwright MCP confirms navigation works consistently across all pages**
- **Playwright MCP validates brand styling matches other pages**
- **Playwright MCP confirms professional appearance maintained**

## Test Plan
- `test_stub_pages_render`: Both pages load without errors
- `test_navigation_consistency`: Navigation works across all pages
- `test_brand_consistency`: Styling matches other pages
- **Playwright MCP validation of all above tests**

## Dependencies
- Depends on: PON-12 (project foundation and styling)

## Suggested Implementation Plan
- Create onboard-client page with placeholder content
- Create generate-avatar page with placeholder content
- Ensure navigation consistency
- Apply brand styling
- Test responsive design
- **Verify with `npm run build`**
- **Use Playwright MCP to validate all stub page requirements**

## Effort Estimate
**1 hour**

## Priority & Impact
- Priority: **Medium**
- Rationale: Complete the app structure

## Acceptance Checklist
- [ ] Both stub pages render correctly
- [ ] Navigation works consistently
- [ ] Brand styling matches other pages
- [ ] Professional appearance maintained
- [ ] **Local build passes with `npm run build`**
- [ ] **Playwright MCP validates all stub page requirements**
- [ ] **Playwright MCP confirms navigation consistency**
- [ ] **Playwright MCP validates brand consistency** 