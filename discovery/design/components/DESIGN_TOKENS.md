# 🎨 DESIGN_TOKENS.md

This document defines the core design tokens for PonteAI, using Tailwind-compatible variable names and values. These tokens ensure a consistent, premium, and accessible UI across all components. All values are chosen to match both the component specs and the live ponteai.com design system.

---

## 1. Colors

### Brand & Accent
- `--color-primary`: `#F43F5E`  <!-- Rose-500, used for CTAs, highlights -->
- `--color-primary-dark`: `#BE123C` <!-- Rose-700, CTA hover -->
- `--color-accent`: `#00B3A4` <!-- Used for status, progress, accents -->
- `--color-accent-dark`: `#00897B`

### Grays (Backgrounds, Surfaces, Text)
- `--color-bg`: `#F9F9FB` <!-- Main background, light gray -->
- `--color-bg-dark`: `#0D0D0D` <!-- Card/section dark bg -->
- `--color-surface`: `#FFFFFF` <!-- Card/modal surface -->
- `--color-surface-muted`: `#F3F4F6` <!-- Muted surface -->
- `--color-border`: `#E5E7EB` <!-- Border gray-200 -->
- `--color-divider`: `#D1D5DB` <!-- Divider gray-300 -->
- `--color-shadow`: `rgba(0,0,0,0.08)`

### Text
- `--color-text-primary`: `#18181B` <!-- Main text, gray-900 -->
- `--color-text-secondary`: `#6B7280` <!-- gray-500 -->
- `--color-text-inverse`: `#FFFFFF` <!-- On dark bg -->
- `--color-text-muted`: `#9CA3AF` <!-- gray-400 -->
- `--color-text-error`: `#DC2626` <!-- Red-600 -->
- `--color-text-success`: `#059669` <!-- Green-600 -->

### Status
- `--color-success`: `#34D399` <!-- Green-400 -->
- `--color-error`: `#F87171` <!-- Red-400 -->
- `--color-warning`: `#FBBF24` <!-- Amber-400 -->
- `--color-info`: `#38BDF8` <!-- Sky-400 -->

### Tier/Badge Examples
- `--color-tier-1`: `#F43F5E` <!-- Rose-500 -->
- `--color-tier-verified`: `#00B3A4` <!-- Accent -->
- `--color-tier-custom`: `#8B5CF6` <!-- Violet-500 -->

---

## 2. Typography

- `--font-sans`: 'Inter', 'ui-sans-serif', 'system-ui', sans-serif;
- `--font-mono`: 'Menlo', 'Monaco', 'ui-monospace', monospace;

### Font Sizes
- `--text-xs`: 0.75rem;   /* 12px */
- `--text-sm`: 0.875rem;  /* 14px */
- `--text-base`: 1rem;    /* 16px */
- `--text-lg`: 1.125rem;  /* 18px */
- `--text-xl`: 1.25rem;   /* 20px */
- `--text-2xl`: 1.5rem;   /* 24px */

### Font Weights
- `--font-normal`: 400;
- `--font-medium`: 500;
- `--font-semibold`: 600;
- `--font-bold`: 700;

---

## 3. Spacing (Tailwind scale)
- `--space-0`: 0px;
- `--space-1`: 0.25rem;   /* 4px */
- `--space-2`: 0.5rem;    /* 8px */
- `--space-3`: 0.75rem;   /* 12px */
- `--space-4`: 1rem;      /* 16px */
- `--space-6`: 1.5rem;    /* 24px */
- `--space-8`: 2rem;      /* 32px */
- `--space-12`: 3rem;     /* 48px */
- `--space-16`: 4rem;     /* 64px */

---

## 4. Border Radius
- `--radius-xs`: 4px;
- `--radius-sm`: 8px;
- `--radius-md`: 12px;
- `--radius-lg`: 16px;
- `--radius-full`: 9999px; /* For pill badges */

**Component usage:**
- Cards, forms, modals: `--radius-lg` (16px)
- Media previews: `--radius-md` (12px)
- Badges, tags: `--radius-full`

---

## 5. Shadows
- `--shadow-xs`: 0 1px 2px 0 rgba(0,0,0,0.04);
- `--shadow-sm`: 0 1.5px 6px 0 rgba(0,0,0,0.08);
- `--shadow-md`: 0 4px 16px 0 rgba(0,0,0,0.12);
- `--shadow-lg`: 0 8px 32px 0 rgba(0,0,0,0.16);
- `--shadow-glow`: 0 0 0 4px var(--color-accent, #00B3A4);

---

## 6. Motion & Transitions
- `--transition-fast`: 150ms cubic-bezier(0.4,0,0.2,1);
- `--transition`: 250ms cubic-bezier(0.4,0,0.2,1);
- `--transition-slow`: 300ms cubic-bezier(0.4,0,0.2,1);
- `--motion-ease`: cubic-bezier(0.4,0,0.2,1);

---

## 7. Example Usage (Tailwind v3)

```css
.card {
  @apply bg-[color:var(--color-bg-dark)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-[var(--space-4)];
}
.button-primary {
  @apply bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-3)] font-bold transition-[var(--transition)];
}
```

---

**All tokens are defined for use with Tailwind v3 and CSS custom properties. Adjust or extend as needed for new components or branding updates.**
