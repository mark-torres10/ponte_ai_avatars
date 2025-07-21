# 🎠 CAROUSEL.md

## 🎯 Purpose

The `Carousel` is a horizontally scrollable component for displaying featured avatars, testimonials, or media previews. Used on the landing page and avatar detail pages.

Its goals are to:
- Showcase multiple items in a compact, engaging format
- Support swipe/scroll navigation
- Highlight featured content

---

## 🧱 Component Structure

```markdown
Carousel
├── Left/Right Navigation Buttons
├── Scrollable Track
│ ├── Carousel Item(s)
└── Pagination Dots (optional)
```

---

## 🖼️ Design Specifications

### 📦 Container

| Property      | Value                          |
|---------------|-------------------------------|
| Border Radius | 16px (optional)                |
| Background    | Transparent or light gray      |
| Padding       | 0–16px                         |
| Width         | 100%                           |
| Height        | 200–320px (configurable)       |

---

## 🖼️ Carousel Item

- Can be avatar card, image, video, or testimonial block
- Spacing: 16px between items
- Snap alignment to item center

---

## 🧪 Interactions

- **Swipe/Scroll**: Horizontal drag or scroll
- **Click Navigation**: Left/right arrows
- **Pagination Dots**: Click to jump to item
- **Auto-play**: Optional, with pause on hover

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  showDots?: boolean;
  itemWidth?: number;
  onItemClick?: (index: number) => void;
}
```

## 📱 Responsiveness (Optional)

- Full width on mobile
- Items snap/scroll horizontally

## 🔄 Reusability
Used on landing page, avatar detail, and testimonials

## ✅ Status & Implementation Readiness
- Visual spec complete
- Ready for handoff to dev
- Component stub created in /components/Carousel.tsx 