# 📋 SIDEBAR_METADATA.md

## 🎯 Purpose

The `SidebarMetadata` component displays detailed metadata for an avatar or request. Used on avatar detail and request detail pages. Now optionally includes request mode and Q&A context for requests.

Its goals are to:
- Present key info in a compact, scannable sidebar
- Support quick reference for decision-making
- Reinforce trust and transparency
- Optionally surface request mode and Q&A context for AI-Guided requests

---

## 🧱 Component Structure

```markdown
SidebarMetadata
├── Avatar/Talent Name
├── Agent/Contact Info
├── Tier Badge
├── Pricing/Licensing Structure
├── Available Tones
├── Languages
├── Restrictions/Notes
├── (Optional) Request Mode Badge
└── (Optional) Q&A Context Panel
```

---

## 🖼️ Design Specifications

### 📦 Sidebar

| Property      | Value                          |
|---------------|-------------------------------|
| Border Radius | 16px                           |
| Background    | `#F9F9FB` (light gray)         |
| Shadow        | Soft drop shadow               |
| Padding       | 24px inside                    |
| Width         | 280–340px                      |
| Height        | Auto-fit, full height of page  |

---

## 🏷️ Fields

- **Avatar/Talent Name**: Bold, 18–20px
- **Agent/Contact Info**: Small, gray-500
- **Tier Badge**: See Badge component
- **Pricing/Licensing**: List or table
- **Available Tones**: ToneTag chips
- **Languages**: List or chips
- **Restrictions/Notes**: Small, italic, gray-400
- **(Optional) Request Mode Badge**: "AI-Guided" or "Freeform"
- **(Optional) Q&A Context Panel**: For AI-Guided requests, shows Q&A answers and edit status

---

## 🧪 Interactions

- **Copy Contact**: Click to copy agent email
- **Expand/Collapse**: Optional for long sections
- **Hover Request Mode/Q&A**: Tooltip with details

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface SidebarMetadataProps {
  name: string;
  agentContact?: string;
  tier: string;
  pricing: string;
  tones: string[];
  languages: string[];
  restrictions?: string;
  mode?: 'freeform' | 'ai_guided';
  aiQAContext?: AIQAContext;
}

interface AIQAContext {
  purpose: string;
  tone: string;
  audience: string;
  format: string;
  aiPrompt: string;
  userEdited: boolean;
}
```

## 🔄 Reusability
Used in avatar detail and request detail pages

## ✅ Status & Implementation Readiness
- Visual spec complete
- Ready for handoff to dev
- Component stub created in /components/SidebarMetadata.tsx 