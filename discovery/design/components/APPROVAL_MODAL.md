# 🗳️ APPROVAL_MODAL.md

## 🎯 Purpose

The `ApprovalModal` is a modal dialog for internal reviewers to approve or reject license requests. It provides all necessary context and actions for licensing decisions, including Q&A context for AI-Guided requests.

Its goals are to:
- Present full request details for review
- Enable approval, rejection, and feedback
- Trigger contract generation and audit logging
- Surface Q&A context and edit status for AI-generated requests

---

## 🧱 Component Structure

```markdown
ApprovalModal
├── Request Metadata (top)
├── (If AI-Guided) Q&A Context Panel
├── Full Script/Prompt
├── Usage Intent
├── Licensing Checklist
├── Contract Generation Trigger
├── Feedback/Comments Input
└── Approve/Reject Buttons
```

---

## 🖼️ Design Specifications

### 📦 Modal

| Property      | Value                          |
|---------------|-------------------------------|
| Border Radius | 20px                           |
| Background    | `#FFFFFF` (white)              |
| Shadow        | Large drop shadow              |
| Padding       | 32px inside                    |
| Width         | 480–600px                      |
| Max Height    | 80vh, scrollable if overflow   |

---

## 🏷️ Fields

- **Request Metadata**: ID, avatar, brand, tone, tier, status, origin (Freeform/AI-Guided)
- **Q&A Context Panel (AI-Guided only)**: Shows purpose, tone, audience, format, original AI prompt, and whether user edited the script
- **Full Script/Prompt**: Multiline, scrollable if long
- **Usage Intent**: Marketing, Internal, Ads, etc.
- **Licensing Checklist**: Visual checklist of requirements
- **Contract Generation**: Button to trigger e-sign flow
- **Feedback/Comments**: Textarea for reviewer notes
- **Approve/Reject**: Primary action buttons

---

## 🧪 Interactions

- **Approve/Reject**: Updates request status, triggers audit log
- **Contract Generation**: Opens e-sign modal or triggers backend
- **Feedback**: Optional, required on rejection
- **Modal Close**: Dismisses modal, no action
- **Q&A Context Panel**: Expand/collapse for long context

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface ApprovalModalProps {
  requestId: string;
  avatarName: string;
  brand: string;
  tone: string;
  tier: string;
  prompt: string;
  usageIntent: string;
  status: 'pending' | 'approved' | 'rejected';
  origin: 'freeform' | 'ai_guided';
  aiQAContext?: AIQAContext;
  onApprove: (feedback?: string) => void;
  onReject: (feedback: string) => void;
  onContractGenerate?: () => void;
  onClose: () => void;
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
- Component stub created in /components/ApprovalModal.tsx 