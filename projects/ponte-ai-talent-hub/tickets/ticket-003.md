# Ticket PON-14: Create avatar carousel component with portrait orientation

**Linear Link:** https://linear.app/metresearch/issue/PON-14/create-avatar-carousel-component-with-portrait-orientation

## Context & Motivation
Build the avatar carousel that displays 5 example avatars with manual navigation, replicating the marketplace style from the Ponte AI website. The cards should be portrait-oriented (taller than wide) to allow multiple cards to fit side-by-side in a single row, creating an intuitive carousel experience.

## Functional Requirements
- Display 5 placeholder avatars with marketplace-style cards
- **Avatar cards must be taller than they are wide (portrait orientation)**
- **Multiple cards visible side-by-side in a single horizontal row**
- Manual navigation with arrow buttons to scroll through cards
- Avatar cards include: image, category tag (top-left), play button (top-right), name, rating, bookings, price range, service tags, "Book Avatar" button
- Responsive carousel design that maintains portrait card orientation
- Brand-consistent styling matching Ponte AI website

## Non-Functional Requirements
- Smooth navigation transitions
- Accessible carousel controls
- Mobile-responsive design that adapts card layout appropriately
- **Portrait card orientation maintained across all screen sizes**

## Success Criteria
- Carousel displays 5 avatars correctly
- **Avatar cards are taller than they are wide (portrait orientation)**
- **Multiple cards visible side-by-side in desktop view**
- Manual navigation works with arrow buttons
- Avatar cards match Ponte AI marketplace style exactly
- Responsive design works on all devices while maintaining card proportions
- **Local build passes with `npm run build`**
- **Playwright MCP validates carousel displays all 5 avatars with portrait orientation**
- **Playwright MCP confirms multiple cards visible side-by-side in single row**
- **Playwright MCP validates manual navigation with arrow buttons works**
- **Playwright MCP validates avatar cards match Ponte AI marketplace style exactly**
- **Playwright MCP confirms responsive design maintains portrait orientation on all devices**

## Test Plan
- `test_carousel_renders`: Carousel displays all 5 avatars
- `test_portrait_orientation`: Avatar cards are taller than they are wide
- `test_side_by_side_layout`: Multiple cards visible in single horizontal row
- `test_navigation_works`: Arrow buttons navigate correctly through cards
- `test_card_styling`: Avatar cards match brand styling exactly
- `test_responsive_behavior`: Carousel works on mobile while maintaining proportions
- **Playwright MCP validation of all above tests**

## Dependencies
- Depends on: PON-12 (project foundation and styling)

## Suggested Implementation Plan
- Create AvatarCard component with portrait orientation (taller than wide)
- Design cards to include: category tag (top-left), play button (top-right), image area, name, rating, bookings, price range, service tags, "Book Avatar" button
- Build Carousel component with horizontal scrolling and manual navigation
- Ensure multiple cards visible side-by-side in desktop view
- Add placeholder avatar data matching the Ponte AI examples
- Implement responsive design that maintains portrait orientation
- Style with extracted brand assets
- **Verify with `npm run build`**
- **Use Playwright MCP to validate carousel functionality, portrait orientation, and side-by-side layout**

## Effort Estimate
**2 hours**

## Priority & Impact
- Priority: **High**
- Rationale: Core functionality

## Acceptance Checklist
- [ ] Carousel displays 5 avatars
- [ ] **Avatar cards are taller than they are wide (portrait orientation)**
- [ ] **Multiple cards visible side-by-side in single horizontal row**
- [ ] Manual navigation works correctly with arrow buttons
- [ ] Avatar cards match Ponte AI styling exactly
- [ ] Responsive design implemented while maintaining portrait orientation
- [ ] Brand consistency achieved
- [ ] **Local build passes with `npm run build`**
- [ ] **Playwright MCP validates all carousel requirements including portrait orientation**
- [ ] **Playwright MCP confirms side-by-side layout works correctly**
- [ ] **Playwright MCP validates responsive design maintains portrait orientation**
- [ ] **Playwright MCP validates brand consistency** 