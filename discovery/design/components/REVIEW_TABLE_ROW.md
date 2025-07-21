# 🗂️ REVIEW_TABLE_ROW.md

## 🎯 Purpose

The `ReviewTableRow` is a row component for the internal licensing review dashboard. It displays metadata for each license request and provides an action to open the approval modal.

Its goals are to:
- Present all key request info in a compact, scannable row
- Enable quick access to review/approval actions
- Indicate request origin (Freeform or AI-Guided) and surface Q&A context if available

---

## 🧱 Component Structure

```markdown
ReviewTableRow
├── Request ID
├── Avatar Name (with thumbnail)
├── Brand
├── Tone Tag
├── Tier Badge
├── Prompt Snippet
├── Created At
├── Status
├── Request Origin (icon or badge)
└── Action Button: Review
```

---

## 🖼️ Design Specifications

### 📦 Row

| Property      | Value                          |
|---------------|-------------------------------|
| Height        | 56–64px                        |
| Background    | `#FFFFFF` (white) or zebra stripe |
| Border        | Bottom 1px, `#E5E7EB` (gray-200) |
| Padding       | 0 16px                         |
| Font          | 15px, Inter                    |
| Alignment     | Vertically centered            |

---

## 🏷️ Fields

- **Request ID**: Shortened UUID or slug
- **Avatar Name**: Linked, with thumbnail
- **Brand**: Org or email
- **Tone Tag**: See ToneTag component
- **Tier Badge**: See Badge component
- **Prompt Snippet**: First 1–2 lines
- **Created At**: UTC timestamp
- **Status**: Pending / Approved / Rejected (color-coded)
- **Request Origin**: Icon or badge (e.g., 🤖 for AI-Guided, ✏️ for Freeform)
- **Action**: "Review" button (opens ApprovalModal)

---

## 🧪 Interactions

- **Click Review**: Opens ApprovalModal for this request
- **Row Hover**: Highlight row background
- **Click Avatar Name**: Navigates to avatar detail
- **Hover Request Origin**: Tooltip with mode and, if AI, a summary of Q&A context

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface ReviewTableRowProps {
  requestId: string;
  avatarName: string;
  avatarThumbnailUrl: string;
  brand: string;
  tone: string;
  tier: string;
  promptSnippet: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  origin: 'freeform' | 'ai_guided';
  aiQAContext?: AIQAContext;
  onReview: () => void;
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
Used in /internal/review and /internal/talent dashboards

## ✅ Status & Implementation Readiness
- Visual spec complete
- Ready for handoff to dev
- Component stub created in /components/ReviewTableRow.tsx 