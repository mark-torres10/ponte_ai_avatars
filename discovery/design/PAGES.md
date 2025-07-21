# 📄 PonteAI Pages & Screens Overview

| Page Name                | Route                       | Contains                                      |
|--------------------------|-----------------------------|-----------------------------------------------|
| Login Page               | `/login`                    | Auth form (email/social), redirect on success |
| Avatar Marketplace       | `/avatars`                  | Avatar grid, filters (tone, tier), tags, CTA  |
| Avatar Detail Page       | `/avatars/[id]`             | Hero media, bio, sidebar metadata, CTA        |
| Request Form Page        | `/request/[id]` or inline   | Mode selector, Freeform + AI-Guided form, Q&A |
| Submission Confirmation  | (after request submit)       | Success message, timeline, next steps         |
| Dashboard Page           | `/dashboard`                | User's request history, statuses, actions      |
| Admin Review Dashboard   | `/internal/review`          | Table of requests, status, modal approvals     |
| Talent Review Queue      | `/internal/talent`          | Queue of approved requests, talent actions     |

---

## Page Details

- **Login Page:**
  - Secure authentication (email/social)
  - Redirects to marketplace on success

- **Avatar Marketplace:**
  - Grid of `AvatarLicenseCard`s
  - Filtering by tone, tier, use case
  - Search and tag chips
  - CTA to view details or request

- **Avatar Detail Page:**
  - Hero media (video/image carousel)
  - Bio, testimonials, licensing terms
  - Sidebar with metadata (tier, pricing, agent)
  - CTA to request avatar (opens form)

- **Request Form Page:**
  - Mode selector (Freeform or AI-Guided)
  - Multi-step form (Q&A wizard, script editor)
  - Draft management, validation, submission

- **Submission Confirmation:**
  - Success state after request
  - TimelineStatusBlock for progress
  - CTAs to track requests or submit another

- **Dashboard Page:**
  - Table/list of user's requests
  - Status indicators (pending, approved, rejected)
  - Actions to view, edit, or resubmit

- **Admin Review Dashboard:**
  - Table of all incoming requests
  - Filters by status, tone, date
  - `ReviewTableRow` and `ApprovalModal` for actions

- **Talent Review Queue:**
  - Table/queue of requests approved by admin
  - Talent can approve, decline, or request revisions
  - Status and scheduling info
