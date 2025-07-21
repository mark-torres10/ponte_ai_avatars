# 🏷️ TONE_TAG.md

## 🎯 Purpose

The `ToneTag` is a visual chip/tag component representing the tone of an avatar or request (e.g., "Professional", "Friendly"). Used in cards, forms, and tables.

Its goals are to:
- Visually communicate tone at a glance
- Support filtering and selection in forms
- Reinforce brand and UX clarity

---

## 🧱 Component Structure

```markdown
ToneTag
└── Label (e.g., "Professional")
```

---

## 🖼️ Design Specifications

### 📦 Tag

| Property      | Value                          |
|---------------|-------------------------------|
| Border Radius | 12px                           |
| Background    | `#1F2937` (gray-800)           |
| Text Color    | `#F9FAFB` (gray-50)            |
| Padding       | 4px 10px                       |
| Font Size     | 13px                           |
| Font Weight   | Medium                         |
| Margin        | 4px right/left                 |

---

## 🧪 Interactions

- **Hover**: Optional tooltip with tone description
- **Selectable**: Optional, for filter UIs
- **No click by default**

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface ToneTagProps {
  tone: string;
  description?: string;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (tone: string) => void;
}
```

## 🔄 Reusability
Used in AvatarLicenseCard, forms, tables, and filters

## ✅ Status & Implementation Readiness
- Visual spec complete
- Ready for handoff to dev
- Component stub created in /components/ToneTag.tsx 