# 📇 AVATAR_LICENSE_CARD.md

## 🎯 Purpose

The `AvatarLicenseCard` is a reusable UI component that displays a summarized profile of an AI avatar in the PonteAI marketplace grid. It is designed for use in `/avatars` and other listings where avatars are featured or recommended.

Its goals are to:
- Present key licensing and branding information at a glance
- Offer an engaging, visually rich summary with a clear call to action
- Support click-to-preview and responsive grid layout

---

## 🧱 Component Structure

```markdown
AvatarLicenseCard
├── Badge (Top-left): Tier/Verification Label
├── Media Container
│ ├── Preview Image or Video Placeholder
│ └── Play Icon (Top-right overlay)
├── Name & Tagline
├── Tier Badge
├── Tone Tags
├── CTA Button: Request License
```

---

## 🖼️ Design Specifications

### 📦 Container

| Property      | Value                          |
|---------------|-------------------------------|
| Border Radius | 16px                           |
| Background    | `#0D0D0D` (dark gray/black)    |
| Shadow        | Soft glow with avatar brand color or fixed accent |
| Padding       | 16px inside                    |
| Width         | ~280–320px (flexible grid)     |
| Height        | ~auto-fit, consistent row size |

---

## 🔖 Top Badge (Tier/Verification)

| Property     | Value                         |
|--------------|-------------------------------|
| Position     | Top-left over image           |
| Text         | e.g., "Tier 1 Celebrity", "Verified" |
| Font Size    | 12–14px                        |
| Font Weight  | Semi-bold                     |
| Color        | `#FFFFFF`                     |
| Background   | Tier/verification color (see Badge spec) |
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

## 🧑 Name & Tagline

- Name Font Size: 18–20px, Bold, White
- Tagline Font Size: 14–15px, Medium, Gray-300
- Margin Top: 12px from video

---

## 🏷️ Tier Badge & Tone Tags

- Tier Badge: See Badge component spec
- Tone Tags: See ToneTag component spec
- Layout: Inline row, wraps if overflow

---

## 📅 Request License Button

| Property     | Value                          |
|--------------|--------------------------------|
| Text         | "Request License"              |
| Font         | Bold, 15–16px                  |
| Color        | White                          |
| Background   | Accent (e.g., `#F43F5E`)       |
| Hover        | Darker accent                  |
| Padding      | 12px vertical, full width      |
| Icon         | License or similar             |
| Border Radius| 12px                           |

---

## 🧪 Interactions

- **Click Image/Play Icon**: Opens inline video player or modal
- **Click Card Body**: Optional – could open full avatar profile
- **Click Button**: Takes user to `/request/[id]`
- **Hover Card**: Slight scale up + shadow elevation
- **Hover Tags or Badges**: No interaction by default

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface AvatarLicenseCardProps {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string;
  videoPreviewUrl?: string;
  tier: 'Tier 1 Celebrity' | 'Creator' | 'Custom';
  isVerified: boolean;
  toneTags: string[];
  onRequest?: () => void;
}
```

## 📱 Responsiveness (Optional)

- Web only for now
- Max-width grid with 3–4 columns
- Cards wrap naturally based on screen size
- Fixed height for card body to avoid vertical jitter

## 🔄 Reusability
Used in /avatars marketplace grid
Future use in /dashboard/recommendations, /search, or homepage

## ✅ Status & Implementation Readiness
- Visual spec complete
- Ready for handoff to dev
- Component stub created in /components/AvatarLicenseCard.tsx 