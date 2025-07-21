# 🧑‍💻 PonteAI Frontend Execution Plan (Engineer Notes & Implementation Blueprint)

## 🌍 Framework & Stack Decisions

- **Framework**: Next.js 14+ (App Router, not Pages Router)
- **Styling**: TailwindCSS + shadcn/ui for component primitives
- **Icons**: Heroicons (default) and Lucide for extended cases
- **Auth**: Clerk or Auth.js (formerly NextAuth.js) – whichever has better support for Vercel + social login
- **State Management**: Minimal state via React + local component state; persistent data via backend and server actions or API routes
- **Deployment Target**: Vercel
- **API Layer**: Use Next.js server actions or API routes depending on complexity

---

## 🔐 Authentication Flow

### Pages & Routes
- `/login`: Login page, possibly with social login options
- `/dashboard`: Gated page for request tracking
- `/logout`: Optional endpoint for logout handling
- Protect all routes from `/request`, `/dashboard`, and internal dashboards using middleware

### Implementation Notes:
- Use Next.js middleware to redirect unauthenticated users to `/login`
- Store login tokens in secure HTTP-only cookies
- Create a reusable `useAuth()` hook or use built-in context from Clerk/Auth.js

---

## 🧭 Routing Structure

### App Routes:
```txt
/
  └── avatars/
        ├── index.tsx         ← Avatar grid
        └── [id]/page.tsx     ← Avatar detail + request form
/request/[id]/page.tsx        ← Full request form if split out
/dashboard/page.tsx           ← User's submissions + statuses
/internal/review/page.tsx     ← Internal approval dashboard
/internal/talent/page.tsx     ← Talent approval queue
/login/page.tsx               ← Auth
```

---

## 🧩 Component Architecture

### Use Tailwind + shadcn/ui for:

| Component             | Source            | Notes |
|----------------------|-------------------|-------|
| Button               | shadcn/ui         | For all CTAs, including form actions |
| Input, Textarea      | shadcn/ui         | With character counter and helper |
| Tabs                 | shadcn/ui         | For Avatar Detail tabs |
| Dialog / Modal       | shadcn/ui         | For previews, approvals |
| Toaster              | `@/components/ui/sonner` | For form errors and success |
| Badge / Tag          | Tailwind + custom | For tone, tier, status |
| Card                 | Tailwind + shadcn | Avatar Cards, Approval Cards |
| EmptyState           | Custom            | “No avatars found” view |

---

## 🧑‍🎨 Avatar Card Component

### Props:
```ts
{
  id: string;
  name: string;
  tagline: string;
  videoPreviewUrl: string;
  imageUrl: string;
  toneTags: string[];
  tier: 'Tier 1 Celebrity' | 'Creator' | 'Custom';
  isRequestable: boolean;
  createdAt: string;
}
```

### Behavior:
- **Click-to-play preview** (no autoplay or hover play)
- Display static preview image initially
- On click: show modal or replace image with `video` tag
- Max duration: 60 seconds
- CTA: "Request License"

---

## 🧾 Avatar Detail Page

### Layout:
- Tabs: "Overview", "Licensing Terms", "Testimonials"
- Sticky CTA: "Request License" → scrolls to embedded form or opens modal

### Avatar Section:
- Large video player (mute by default)
- Metadata (Tone, Use Case Tags, Tier badge)
- Agent/Legal contact stub for future integration

---

## 📝 Request Form UX

### Modes:
- **Mode A**: Freeform prompt
- **Mode B**: Guided flow w/ AI-enhanced Q&A to build prompt

### Implementation:
- Tab toggle for modes (e.g., "Custom Prompt" vs. "Help Me Write It")
- For AI guidance, scaffold out:
  - Step 1: What is the video for?
  - Step 2: Preferred tone?
  - Step 3: Audience?
  - Then: Generate prompt preview → allow edits

### Features:
- Global toast for errors/success
- Draft saving:
  - Autosave every 10 seconds or on blur
  - Save to backend (on authenticated user)
- Prevent submission of duplicate prompt (exact text match)

---

## 🧠 Sorting & Filtering Strategy (Avatar Grid)

### Filters:
- Tone (multi-select)
- Language (optional)
- Tier (Tier 1 / Creator)
- Industry (optional future)
- Sort options:
  - `Date Added` (default)
  - `Most Popular` (disabled with tooltip)

### Implementation Notes:
- Popularity based on `request_count`, tracked in DB
- Disabled sort options should use `disabled` attribute and tooltip like:
  > "Coming Soon: Sort by Most Popular"

---

## 🗂 Internal Dashboards

### Shared Tables:
- Use shadcn's `Table` primitive
- Pagination (server-side if large volume)
- Sort by status or date

### Empty State:
- Avatar search: "No AI avatars found."
- Dashboard: “No requests pending review.”

---

## 🧪 Form & Dashboard Flows

### Form Submission Flow:
- POST to `/api/request` (or use server action)
- On error → global toast (`useToast()` from shadcn)
- On success → redirect to `/dashboard`

### Draft Saving:
- POST to `/api/request/draft`
- Store:
  - `userId`, `avatarId`, `prompt`, `tone`, `status: 'draft'`, `updatedAt`
- Use `debounce` hook to avoid aggressive saving

---

## 🔒 Form Validation

### Rules:
- Required: Prompt, tone, use case
- Limit: 1000 characters max for script
- Auto-trim whitespace
- Debounced uniqueness check on prompt to block duplicates

---

## 🧱 Badge / Tier Tagging

- All badges are static for now:
  - e.g. `"Tier 1 Celebrity"`, `"Verified"`, `"High Impact"`
- Color-coded Tailwind classes:
  - Tier 1 = `bg-blue-100 text-blue-800`
  - Creator = `bg-emerald-100 text-emerald-800`
  - Verified = `bg-gray-100 text-gray-800`

---

## 🛠️ Internal Licensing Review Dashboard

### Route: `/internal/review`

### View:
- Table view with filters:
  - Status (Pending, Approved, Rejected)
  - Tone
  - Date submitted
  - Avatar name

### Table Columns:
| Field         | Notes                              |
|---------------|------------------------------------|
| Request ID    | UUID or shortened slug             |
| Avatar Name   | Linked to avatar detail            |
| Brand         | Email / Org Name (if stored)       |
| Tone          | Text or tag                        |
| Prompt Snippet| 1–2 lines                          |
| Created At    | UTC timestamp                      |
| Status        | Pending / Approved / Rejected      |
| Action        | Button: "Review"                   |

### Actions:
- **Review modal or drawer**:
  - Full request prompt
  - Approve / Reject buttons
  - Optional comments (textarea)
  - Audit history viewer (if enabled)

### Visual Details:
- Empty state component: “No requests pending review.”
- Table is keyboard-accessible
- Uses `shadcn/ui` Table + Drawer for review panel

---

## 👥 Talent Team Approval Queue

### Route: `/internal/talent`

### View:
- Similar table UX to licensing dashboard
- Only shows requests **already approved by internal team**

### Columns:
| Field            | Notes                                  |
|------------------|----------------------------------------|
| Avatar           | Avatar name and thumbnail              |
| Brand            | Requesting brand or org                |
| Approved Tone    | Passed-in tone                         |
| Prompt Snippet   | Display first 140 chars                |
| Requested Use    | Ad / Internal / Promo                  |
| Created At       | UTC timestamp                          |
| Action           | “Approve Generation” or “Decline”      |

### Features:
- Optional “Ask for Revisions” comment box
- Status labels: `Waiting`, `Approved`, `Declined`, `Needs Revisions`
- Modal with inline chat thread (future enhancement)

---

## 🔄 API Route Plan

### Endpoint Convention: RESTful, with clear verbs

| Endpoint                            | Method | Description                          |
|-------------------------------------|--------|--------------------------------------|
| `/api/auth/login`                  | POST   | Login via provider                   |
| `/api/request`                     | POST   | Submit new video request             |
| `/api/request/draft`              | POST   | Save a draft                         |
| `/api/request/:id`                | GET    | View request by ID                   |
| `/api/request/:id`                | PATCH  | Update prompt, tone, etc.            |
| `/api/request/:id/submit`         | POST   | Submit a saved draft                 |
| `/api/request/:id/review`         | POST   | Internal team approves/rejects      |
| `/api/request/:id/talent-review`  | POST   | Talent team approval                 |
| `/api/avatars`                    | GET    | List all avatars                     |
| `/api/avatars/:id`                | GET    | Get avatar detail                    |
| `/api/user/requests`             | GET    | User's submitted requests            |

---

## 📋 Database Schema (Conceptual)

```prisma
model Avatar {
  id          String   @id @default(uuid())
  name        String
  tier        String
  previewUrl  String
  imageUrl    String
  toneTags    String[]
  createdAt   DateTime @default(now())
  requestCount Int     @default(0)
}

model Request {
  id          String   @id @default(uuid())
  userId      String
  avatarId    String
  prompt      String
  tone        String
  useCase     String
  status      RequestStatus
  isDraft     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  internalApproved Boolean
  talentApproved   Boolean
}

enum RequestStatus {
  draft
  submitted
  under_review
  approved
  rejected
}
```

## 🧪 Audit & Activity Feed

```text
- Store approval events in a separate AuditLog table
- Log types: submitted, approved_internal, rejected_internal, approved_talent, resubmitted
- Show feed in admin dashboard modal:“Request submitted at 10:03 AM by mark@company.com”“Approved by reviewer@example.com at 11:00 AM”
```

