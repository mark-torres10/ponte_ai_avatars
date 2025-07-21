# ⏳ TIMELINE_STATUS_BLOCK.md

## 🎯 Purpose

The `TimelineStatusBlock` (or ProgressBar) visually communicates the current status and progress of a license request through the review pipeline. Used in confirmation screens and dashboards.

Its goals are to:
- Show users where their request is in the process
- Make review/approval steps transparent
- Reinforce trust and clarity

---

## 🧱 Component Structure

```markdown
TimelineStatusBlock
├── Step 1: Brand Submitted
├── Step 2: Licensing Review
├── Step 3: Talent Approval
└── (Optional) Step 4: Complete/Delivered
```

---

## 🖼️ Design Specifications

### 📦 Container

| Property      | Value                          |
|---------------|-------------------------------|
| Border Radius | 12px                           |
| Background    | Transparent or light gray      |
| Padding       | 0–8px                          |
| Width         | 100%                           |
| Height        | 48–64px (vertical) or 8–12px (horizontal bar) |

---

## 🟦 Steps

- Each step: Icon + label (e.g., checkmark, review, avatar)
- Current step: Highlighted with accent color (e.g., `#00B3A4`)
- Completed steps: Filled or checked
- Upcoming steps: Muted/gray
- Layout: Horizontal (default), vertical (optional for sidebar)

---

## 🧪 Interactions

- **Hover Step**: Tooltip with step description
- **Animated Progress**: Optional, on step change
- **Accessible**: ARIA labels for screen readers

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface TimelineStatusBlockProps {
  currentStep: 'submitted' | 'under_review' | 'talent_approval' | 'complete';
  steps?: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
  }>;
}
```

## 📱 Responsiveness (Optional)

- Horizontal on desktop, vertical on mobile/sidebars
- Steps wrap or scroll if too many

## 🔄 Reusability
Used in SubmissionConfirmation, dashboards, and request detail views

## ✅ Status & Implementation Readiness
- Visual spec complete
- Ready for handoff to dev
- Component stub created in /components/TimelineStatusBlock.tsx 