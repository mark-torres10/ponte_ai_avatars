# 🛠️ Engineering Notes

## Folder Structure

```
ponte_ai/
  ├── admin/                # Project management, timelines, docs
  ├── code/                 # (To be populated with source code)
  ├── discovery/            # Product/design/UX documentation
  ├── misc/                 # Miscellaneous assets
  ├── outputs/              # Generated outputs, exports
  ├── rules/                # Repo/process rules
  └── README.md             # Project overview
```

- **Frontend (Next.js):**
  - `/app` or `/pages` (depending on Next.js version)
  - `/components` (UI components)
  - `/lib` (utilities, API clients)
  - `/styles` (Tailwind CSS v3)
  - `/hooks`, `/context`, `/store` (state management)
- **Backend (Supabase):**
  - Managed via Supabase dashboard (DB, storage, Edge Functions)
  - Edge Functions for custom API logic

---

## API Contract Sketch

- **Auth:**
  - Supabase Auth (JWT, email/social login)
- **Requests:**
  - `POST /api/requests` — Create new request
  - `GET /api/requests` — List user requests
  - `GET /api/requests/:id` — Get request detail
  - `PATCH /api/requests/:id` — Update (drafts only)
  - `POST /api/requests/:id/submit` — Submit for review
  - `POST /api/requests/:id/approve-internal` — Internal approval
  - `POST /api/requests/:id/approve-talent` — Talent approval
  - `POST /api/requests/:id/reject-internal` — Internal rejection
  - `POST /api/requests/:id/reject-talent` — Talent rejection
  - `POST /api/requests/:id/deliver` — Mark as delivered
- **Avatars:**
  - `GET /api/avatars` — List avatars
  - `GET /api/avatars/:id` — Avatar detail
- **Files:**
  - Supabase Storage for uploads/deliverables

---

## Auth Strategy

- **Supabase Auth**
  - Email/password and social login (Google, etc.)
  - JWT-based session, auto-refresh
  - Role-based access via JWT claims or RLS (Row Level Security) in Supabase
  - Protect API routes and UI pages based on role
  - Use Supabase client SDK in Next.js for auth/session

---

## Deployment Process (Vercel)

- **Frontend:**
  - Deploy Next.js app to Vercel (auto from GitHub)
  - Configure environment variables for Supabase URL/keys
  - Use Vercel preview/staging/production environments
- **Backend:**
  - Supabase project is managed/deployed via Supabase dashboard
  - Edge Functions deployed via Supabase CLI
  - Database migrations managed via Supabase tools
- **CI/CD:**
  - Vercel handles frontend CI/CD
  - Supabase CLI for backend migrations/functions

---

## Draft-Save Debounce Strategy

- **Problem:** Avoid excessive writes to DB while user is editing a draft request.
- **Solution:**
  - Use a debounce (e.g., 500–1000ms) on form input changes
  - Only auto-save if form is dirty and user pauses typing
  - Show save status ("Saving...", "Saved", "Error")
  - Use optimistic UI for better UX
  - On page unload, ensure latest draft is saved (optional: use `beforeunload`)

---

## Notes
- Supabase provides a unified backend (DB, API, auth, storage, Edge Functions) — minimal ops overhead.
- Next.js + Vercel enables fast, scalable frontend deployment with built-in SSR/ISR.
- Tailwind CSS v3 for styling (per user preference).
