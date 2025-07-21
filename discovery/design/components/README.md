# 🧩 PonteAI Component Design Specs

This folder contains detailed design specifications for the core UI components used in the PonteAI platform. Each markdown file documents the purpose, structure, design tokens, and engineering interface for a reusable component. These specs are intended for both designers and engineers to ensure a consistent, premium user experience across the product.

---

## 📚 Component Index

| Component                  | Purpose / Usage                                      |
|----------------------------|-----------------------------------------------------|
| `AVATAR_LICENSE_CARD`      | Avatar summary card for marketplace grid             |
| `TALENT_CARD`              | (Legacy) Talent/Avatar card, similar to above        |
| `REQUEST_LICENSE_FORM`     | Multi-step form for requesting avatar licenses       |
| `SUBMISSION_CONFIRMATION`  | Confirmation and status after request submission     |
| `REVIEW_TABLE_ROW`         | Row for internal review dashboard tables            |
| `APPROVAL_MODAL`           | Modal for internal approval/rejection of requests    |
| `TIMELINE_STATUS_BLOCK`    | Progress bar/timeline for request status             |
| `TONE_TAG`                 | Visual chip/tag for tone selection and display       |
| `CAROUSEL`                 | Horizontally scrollable featured content             |
| `SIDEBAR_METADATA`         | Sidebar for detailed avatar/request metadata         |

---

## 📝 Component Summaries

### `AVATAR_LICENSE_CARD.md`
A reusable card for displaying a summarized profile of an AI avatar in the marketplace grid. Shows avatar image/video, name, tier, badges, tagline, and a CTA to request a license. Designed for visual clarity, quick scanning, and engaging interaction.

### `TALENT_CARD.md`
Legacy version of the avatar card, included for reference. Similar structure and design intent as `AVATAR_LICENSE_CARD`.

### `REQUEST_LICENSE_FORM.md`
A multi-step form for brands to request a license and submit a video script for an avatar. Supports both Freeform and AI-Guided flows, with a mode selector, Q&A wizard, script preview/editor, and draft management. Designed for clarity, validation, and user guidance.

### `SUBMISSION_CONFIRMATION.md`
Displays a confirmation message and progress timeline after a request is submitted. Reinforces next steps and trust, optionally showing the request mode (Freeform or AI-Guided).

### `REVIEW_TABLE_ROW.md`
A row component for the internal licensing review dashboard. Shows request metadata, status, and an action to open the approval modal. Indicates request origin (Freeform/AI-Guided) and can surface Q&A context.

### `APPROVAL_MODAL.md`
A modal dialog for internal reviewers to approve or reject license requests. Surfaces all relevant request details, including Q&A context for AI-Guided requests, and supports contract generation and feedback.

### `TIMELINE_STATUS_BLOCK.md`
A visual progress bar or timeline showing the current status of a license request (e.g., Brand Submitted → Licensing Review → Talent Approval). Used in confirmation screens and dashboards.

### `TONE_TAG.md`
A visual chip/tag for representing the tone of an avatar or request (e.g., "Professional", "Friendly"). Used in cards, forms, and filters. Designed for quick recognition and filtering.

### `CAROUSEL.md`
A horizontally scrollable component for displaying featured avatars, testimonials, or media previews. Used on landing and detail pages. Supports swipe, navigation, and pagination dots.

### `SIDEBAR_METADATA.md`
A sidebar component for displaying detailed metadata about an avatar or request. Includes fields for name, agent, tier, pricing, tones, languages, restrictions, and optionally request mode and Q&A context.

---

## 🎨 Design Philosophy
- **Consistency:** All components use a shared set of design tokens (colors, radii, shadows) for a premium, unified look.
- **Clarity:** Layouts and interactions are optimized for enterprise users—information is scannable, actions are clear.
- **Reusability:** Components are designed to be used across multiple pages and flows, with flexible props and slots.
- **Responsiveness:** All components are specified for web, with guidance for mobile adaptation where relevant.

---

For detailed specs, props, and visual guidelines, see each component's `.md` file in this folder.
