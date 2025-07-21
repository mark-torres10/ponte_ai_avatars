# 🧭 STATES_AND_BEHAVIORS.md

This document specifies the key UI states, validation rules, and interaction behaviors for the PonteAI platform. It is intended to ensure a consistent, accessible, and delightful user experience across all components and pages.

---

## 1. UI States

### Loading States
- **Components:**
  - Show animated spinner or skeleton placeholder (e.g., for cards, tables, forms).
  - Use subtle shimmer for skeletons (Tailwind animate-pulse).
- **Pages:**
  - Centered spinner for full-page loads.
  - Disable primary actions while loading.

### Error States
- **Inline errors:**
  - Red text below input or field.
  - Error icon (e.g., Heroicons ExclamationCircle).
- **Global errors:**
  - Toast notification (red background, white text).
  - Error banner at top of page for critical failures.
- **Retry:**
  - Show "Retry" button for failed fetches or submissions.

### Empty States
- **Components:**
  - Show friendly illustration/icon.
  - Message: e.g., "No avatars found", "No requests yet".
  - Optional CTA: "Browse Avatars", "Submit Request".
- **Tables/Lists:**
  - Centered message with icon.

### Success States
- **Inline:**
  - Green check icon, success text below field.
- **Global:**
  - Toast notification (green background, white text).
  - Submission confirmation screen with TimelineStatusBlock.

---

## 2. Form Validation

- **Prompt/Script:**
  - Required, min 10 chars, max 1000 chars.
  - Show error if too short/long: "Prompt must be at least 10 characters."
- **Tone:**
  - Required, must be from allowed set (or valid custom if supported).
  - Show error: "Please select a valid tone."
- **Use Case:**
  - Required.
- **Attachments:**
  - Optional, validate file type/size (max 10MB, PDF/PNG/JPG).
- **Usage Type:**
  - Required (radio: Marketing, Internal, Ads).
- **Deadline:**
  - Optional, must be a valid future date if provided.
- **General:**
  - Show errors on blur or submit.
  - Disable submit if any errors.
  - Show character counter for textareas.

---

## 3. Interaction Rules

### Hover
- **Buttons:**
  - Slight background color darken, shadow elevation.
  - Cursor: pointer.
- **Cards/Rows:**
  - Scale up (1.02x), shadow elevation.
  - Show play icon overlay on media.
- **Tags/Badges:**
  - Optional tooltip on hover.

### Focus
- **Inputs/Buttons:**
  - 2px outline (Tailwind ring-2, accent color).
  - Always visible for keyboard navigation.
- **Modal/Dialog:**
  - Trap focus within modal.

### Click
- **Buttons/CTAs:**
  - Ripple or scale-down animation (0.95x).
  - Immediate feedback on press.
- **Cards:**
  - Open detail or modal on click.
- **Table Rows:**
  - Highlight row, open modal on action click.

### Keyboard
- **Tab order:**
  - Logical, matches visual order.
- **Enter:**
  - Submits forms, advances steps in wizards.
- **Esc:**
  - Closes modals/dialogs.
- **Arrow keys:**
  - Navigate dropdowns, carousels, and lists.

---

## 4. Motion & Transitions

- **Toasts:**
  - Slide in from bottom or top, fade out after 3–5s.
  - Easing: ease-in-out.
- **Buttons:**
  - Scale-down on press, smooth return on release.
- **Modals/Dialogs:**
  - Fade and scale in (0.95→1.0), fade out on close.
  - Backdrop fades in/out.
- **Dropdowns/Menus:**
  - Fade and slide down/up.
- **Carousels:**
  - Smooth horizontal scroll, snap to item.
- **Progress Bars/Steppers:**
  - Animate progress fill, step transitions.
- **Skeletons:**
  - Subtle shimmer (pulse) animation.

---

**All motion should be fast (150–300ms), use system prefers-reduced-motion where possible, and never block user input.** 