# 📝 REQUEST_LICENSE_FORM.md

## 🎯 Purpose

The `RequestLicenseForm` is a multi-step form component for brands to request a license and submit a video script for an AI avatar. It supports both new submissions and management of draft/submitted requests, and now includes both Freeform and AI-Guided request modes.

Its goals are to:
- Guide users through script, licensing, and review steps
- Provide autosave, inline validation, and draft management
- Enable editing, resubmission, and deletion of requests
- Support both Freeform and AI-Guided flows, tracking request origin and Q&A context

---

## 🧱 Component Structure

```markdown
RequestLicenseForm
├── ModeSelector (Freeform vs. AI-Guided)
├── (If Freeform) Script/Prompt Input
├── (If AI-Guided) Q&A Wizard (4 steps)
│   ├── Step 1: Purpose
│   ├── Step 2: Tone
│   ├── Step 3: Audience
│   ├── Step 4: Format
│   └── Script Preview/Editor (AI-generated)
├── Stepper/ProgressBar (top)
├── License & Usage Details
├── Review & Submit
├── Draft/Submission Management Panel
└── Confirmation State (on submit)
```

---

## 🖼️ Design Specifications

### 📦 Container

| Property      | Value                          |
|---------------|-------------------------------|
| Border Radius | 16px                           |
| Background    | `#F9F9FB` (light gray)         |
| Shadow        | Soft drop shadow               |
| Padding       | 24px inside                    |
| Width         | 100% (max 480–600px)           |
| Margin        | Centered on page/modal         |

---

## 🔀 ModeSelector

- Two options: ✏️ Freeform Request, 🤖 AI-Guided Request (with "Recommended" badge)
- User must select a mode before proceeding
- Mode is tracked and passed to backend for analytics and review context

---

## 🤖 AI-Guided Q&A Wizard

- **Step 1:** What is this video for? (radio/segmented, custom option)
- **Step 2:** What tone should the avatar use? (ToneTag chips, custom option)
- **Step 3:** Who is your target audience? (textarea, templates)
- **Step 4:** Any format or length preferences? (checkboxes/chips)
- **Progress Indicator:** "Step X of 4" at top
- **Auto-save:** Save responses between steps
- **Validation:** Prevent empty answers
- **Keyboard navigation:** Tab/Enter support

---

## ✍️ Script Preview + Editor

- After Q&A, show AI-generated script in large textarea
- Buttons: "Copy", "Reset", "Edit Manually"
- Confidence badge: e.g., "Great start!" or "You may want to revise tone"
- Optionally highlight suggestions
- User can edit before final submission
- Q&A context is saved and surfaced for reviewers

---

## 📝 Freeform Prompt

- Single textarea for user to write custom script
- Helper text, tooltip, 1000 char max

---

## 🧪 Interactions

- **Autosave:** Every 10s or on blur
- **Inline Validation:** Required fields, char limits, uniqueness check
- **Draft Management:** View, edit, resubmit, or delete drafts
- **Submission:** On success, show confirmation state
- **Error Handling:** Global toast for errors
- **Track request origin:** Mode (Freeform/AI-Guided) and Q&A context are included in submission payload

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface RequestLicenseFormProps {
  avatarId: string;
  initialDraft?: RequestDraft;
  onSubmit: (data: RequestSubmission) => void;
  onDeleteDraft?: (draftId: string) => void;
}

interface RequestDraft {
  id: string;
  mode: 'freeform' | 'ai_guided';
  prompt: string;
  aiQAContext?: AIQAContext;
  tone: string;
  useCase: string;
  attachments?: File[];
  usageType: 'Marketing' | 'Internal' | 'Ads';
  deadline?: string;
  status: 'draft' | 'submitted';
}

interface AIQAContext {
  purpose: string;
  tone: string;
  audience: string;
  format: string;
  aiPrompt: string;
  userEdited: boolean;
}

interface RequestSubmission extends Omit<RequestDraft, 'status'> {
  status: 'submitted';
}
```

## 📱 Responsiveness (Optional)

- Full width on mobile
- Centered modal or panel on desktop
- Stepper adapts to screen size

## 🔄 Reusability
Used in /request/[id] and as embedded form in avatar detail page

## ✅ Status & Implementation Readiness
- Visual spec complete
- Ready for handoff to dev
- Component stub created in /components/RequestLicenseForm.tsx 