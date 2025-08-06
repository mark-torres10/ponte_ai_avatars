# Ticket PON-15: Build request-talent page with form and submission flow

**Linear Link:** https://linear.app/metresearch/issue/PON-15/build-request-talent-page-with-form-and-submission-flow

## Context & Motivation
Create the main request-talent page that combines the avatar carousel with a free-form intake form and submission confirmation. This replaces the manual email workflow and provides the core user experience.

## Functional Requirements
- "Request Talent" header
- Avatar carousel (from PON-14)
- Free-form intake form with appropriate fields
- Submit button with confirmation message
- Form validation and error handling
- Responsive design

## Non-Functional Requirements
- Form accessibility
- Responsive design
- Professional appearance

## Success Criteria
- Page combines carousel and form correctly
- Form submission shows confirmation message
- Form validation works appropriately
- Professional appearance suitable for demos
- **Local build passes with `npm run build`**
- **Playwright MCP validates page layout combines carousel and form correctly**
- **Playwright MCP confirms form submission shows confirmation message**
- **Playwright MCP validates form validation works appropriately**
- **Playwright MCP confirms responsive design on all devices**
- **Playwright MCP validates professional appearance suitable for demos**

## Test Plan
- `test_page_layout`: Page renders with carousel and form
- `test_form_submission`: Form shows confirmation on submit
- `test_form_validation`: Form validates inputs correctly
- `test_responsive_design`: Page works on all devices
- **Playwright MCP validation of all above tests**

## Dependencies
- Depends on: PON-12 (project foundation), PON-14 (avatar carousel)

## Suggested Implementation Plan
- Create request-talent page layout
- Integrate avatar carousel component
- Build intake form with ShadCN components
- Add form submission handler with confirmation
- Implement responsive design
- **Verify with `npm run build`**
- **Use Playwright MCP to validate all page requirements and functionality**

## Effort Estimate
**2 hours**

## Priority & Impact
- Priority: **High**
- Rationale: Core user functionality

## Acceptance Checklist
- [ ] Page layout combines carousel and form
- [ ] Form submission shows confirmation
- [ ] Form validation works correctly
- [ ] Responsive design implemented
- [ ] Professional appearance achieved
- [ ] **Local build passes with `npm run build`**
- [ ] **Playwright MCP validates all functional requirements**
- [ ] **Playwright MCP confirms responsive design works**
- [ ] **Playwright MCP validates professional appearance** 