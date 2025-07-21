# 📇 TALENT_CARD.md

## 🎯 Purpose

The `TalentCard` is a reusable UI component that displays a summarized profile of a talent or AI avatar available on the PonteAI platform. It is designed for use in the **avatar marketplace grid** (`/avatars`) and potentially in other recommendation or featured listings.

Its goals are to:
- Present key booking and branding information at a glance
- Offer an engaging, visually rich summary with a clear call to action
- Support click-to-preview behavior and responsive layout in a grid

---

## 🧱 Component Structure

```markdown
TalentCard
├── Badge (Top-left): Category Label
├── Media Container
│ ├── Preview Image or Video Placeholder
│ └── Play Icon (Top-right overlay)
├── Name
├── Rating & Booking Count
├── Price Range
├── Tags (Use Cases)
└── CTA Button: Book Avatar
```

---

## 🖼️ Design Specifications

### 📦 Container

| Property      | Value                          |
|---------------|-------------------------------|
| Border Radius | 16px                           |
| Background    | `#0D0D0D` (dark gray/black)    |
| Shadow        | Soft glow with avatar brand color or fixed pink glow |
| Padding       | 16px inside                    |
| Width         | ~280–320px (flexible grid)     |
| Height        | ~auto-fit, consistent row size |

---

## 🔖 Top Badge (Category Label)

| Property     | Value                         |
|--------------|-------------------------------|
| Position     | Top-left over image           |
| Text         | e.g., "Tech Influencer"       |
| Font Size    | 12–14px                        |
| Font Weight  | Semi-bold                     |
| Color        | `#FFFFFF`                     |
| Background   | `#F43F5E` (Rose-500) or brand accent |
| Padding      | 6px 12px                      |
| Border Radius| Full / pill-style             |

---

## 🎥 Media Preview

| Property     | Value                          |
|--------------|--------------------------------|
| Type         | Static image or paused video frame |
| Aspect Ratio | 4:3 or 16:9 depending on media |
| Interaction  | Click-to-play interaction      |
| Play Icon    | Top-right corner overlay       |
| Border Radius| 12px                           |
| Shadow       | Inner glow or dark halo        |

> On click, media plays in place or opens a modal (depending on page config).

---

## 🧑 Name

- Font Size: 18–20px
- Font Weight: Bold
- Color: White
- Margin Top: 12px from video

---

## ⭐ Rating & 📈 Bookings

| Property | Value |
|----------|-------|
| Icon     | Star (yellow `#FACC15`) and User Icon (gray `#9CA3AF`) |
| Text     | "4.9" and "1250 bookings" |
| Font     | 14–15px, medium |
| Layout   | Inline row, aligned left |

---

## 💰 Price Range

| Property     | Value |
|--------------|-------|
| Font Size    | 14–16px |
| Font Weight  | Semi-bold |
| Color        | Gradient Pink `#F43F5E` to `#F87171` |
| Format       | "$2,500 - $15,000" |
| Margin Top   | 8px |

---

## 🏷️ Use Case Tags

- Example: `Product Launches`, `Training Videos`
- Style:
  - Background: `#1F2937` (gray-800)
  - Text: `#F9FAFB` (gray-50)
  - Padding: 4px 10px
  - Border Radius: 12px
- Font Size: 13px
- Layout: Inline row, wraps to next line if overflow

---

## 📅 Book Button

| Property     | Value                          |
|--------------|--------------------------------|
| Text         | "📅 Book Avatar"               |
| Font         | Bold, 15–16px                  |
| Color        | White                          |
| Background   | Rose-500 `#F43F5E`             |
| Hover        | Rose-600                       |
| Padding      | 12px vertical, full width      |
| Icon         | Calendar or similar            |
| Border Radius| 12px                           |

---

## 🧪 Interactions

- **Click Image/Play Icon**: Opens inline video player or modal
- **Click Card Body**: Optional – could also open full avatar profile
- **Click Button**: Takes user to `/avatars/[id]` or `/request/[id]`
- **Hover Card**: Slight scale up + shadow elevation
- **Hover Tags or Ratings**: No interaction by default

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface TalentCardProps {
  id: string;
  name: string;
  avatarImageUrl: string;
  videoPreviewUrl?: string;
  category: string; // e.g. "Celebrity Chef"
  rating: number;   // e.g. 4.9
  bookings: number; // e.g. 1250
  priceRange: [number, number]; // [2500, 15000]
  useCases: string[]; // e.g. ["Product Launches", "Training Videos"]
  onBook?: () => void;
}
```

## 📱 Responsiveness (Optional)

For now: Web only, but recommend:

Max-width grid with 3–4 columns

Cards wrap naturally based on screen size

Fixed height for card body to avoid vertical jitter

## 🔄 Reusability
Used in /avatars marketplace grid

Future use in /dashboard/recommendations, /search, or homepage

## ✅ Status & Implementation Readiness
- Visual spec complete
- Ready for handoff to dev
- Component stub created in /components/TalentCard.tsx