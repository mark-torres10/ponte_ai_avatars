# ✅ SUBMISSION_CONFIRMATION.md

## 🎯 Purpose

The `SubmissionConfirmation` component provides feedback to users after submitting a license request. It visually communicates the next steps and current status in the review process, and now optionally indicates the request mode (Freeform or AI-Guided).

Its goals are to:
- Confirm successful submission
- Show progress through the review/approval pipeline
- Offer clear next actions (track, submit another)
- Optionally display the request mode for user clarity

---

## 🧱 Component Structure

```markdown
SubmissionConfirmation
├── Success Icon/Message
├── TimelineStatusBlock / ProgressBar
├── Confirmation Text
├── (Optional) Request Mode Badge/Note
└── CTA Buttons (Track Requests, Submit Another)
```

---

## 🖼️ Design Specifications

### 📦 Container

| Property      | Value                          |
|---------------|-------------------------------|
| Border Radius | 16px                           |
| Background    | `#F9F9FB` (light gray)         |
| Shadow        | Soft drop shadow               |
| Padding       | 32px inside                    |
| Width         | 100% (max 480–600px)           |
| Margin        | Centered on page/modal         |

---

## 🟢 Success State

- Large checkmark or success icon
- Message: "Request Submitted!"
- Subtext: "Your request is under review. We'll notify you when it's approved."
- (Optional) Badge or note: "Submitted via AI-Guided Builder" or "Submitted via Freeform"

---

## 🕒 TimelineStatusBlock / ProgressBar

- Visualizes steps: Brand Submitted → Licensing Review → Talent Approval
- Shows current step (e.g., "In Review")
- Color: Accent (e.g., `#00B3A4`)
- Responsive for mobile/desktop

---

## 🧪 Interactions

- **Track Requests**: Button to `/dashboard` or request tracking page
- **Submit Another**: Button to start a new request
- **Auto-dismiss**: Optional, after a few seconds

---

## 🧑‍💻 Props for Engineering (TypeScript Example)

```ts
interface SubmissionConfirmationProps {
  requestId: string;
  currentStep: 'submitted' | 'under_review' | 'approved' | 'rejected';
  mode?: 'freeform' | 'ai_guided';
  onTrackRequests?: () => void;
  onSubmitAnother?: () => void;
}
```

## 📱 Responsiveness (Optional)

- Full width on mobile
- Centered modal or panel on desktop

## 🔄 Reusability
Used after submitting a license request

## ✅ Status & Implementation Readiness
- Visual spec complete
- Ready for handoff to dev
- Component stub created in /components/SubmissionConfirmation.tsx 