# 🤖 AI-Guided Request Builder – UX Design Spec

## 🎯 Purpose

The AI-guided request builder is an alternative to the freeform prompt entry flow. It helps users who aren't sure how to structure a good avatar request by guiding them through a short series of high-signal questions. The goal is to gather structured context that the backend AI uses to generate a tailored, editable script.

---

## 🧭 High-Level Flow

```
flowchart TD
  A[User lands on Avatar Detail Page] --> B[Clicks "Request Avatar"]
  B --> C{Choose Mode}
  C --> D1[Freeform Prompt]
  C --> D2[Guided AI Request Builder]

  D2 --> E[Q1: What is this video for?]
  E --> F[Q2: What tone should the avatar use?]
  F --> G[Q3: Who is the intended audience?]
  G --> H[Q4: What format is preferred?]
  H --> I[AI generates full script preview]
  I --> J[User edits or accepts]
  J --> K[Submits request]
```

---

## 🧩 Component Breakdown

### `ModeSelector`
- Displayed after clicking "Request Avatar"
- Two options side by side:
  - ✏️ Freeform Request
  - 🤖 AI-Guided Request (with badge: “Recommended for first-time users”)

---

## 🧠 Guided Questions

Each question should be shown as a **step in a progress tracker** (e.g., `Step 1 of 4`). Responses should be collected incrementally.

### Step 1: 🎯 What is this video for?

- Type: Radio or segmented buttons
- Options:
  - Product announcement
  - Social media ad
  - Internal team message
  - Educational explainer
  - Custom (with short input field)

### Step 2: 🎙️ What tone should the avatar use?

- Type: Tone chips with icons
- Options:
  - Friendly
  - Energetic
  - Professional
  - Calm
  - Excited
  - Custom

### Step 3: 🧑‍🤝‍🧑 Who is your target audience?

- Type: Textarea with example placeholder
  - E.g., “Startup founders interested in productivity tools”
- Optional templates:
  - “New users on our app”
  - “Potential customers on Instagram”

### Step 4: 🎞️ Any format or length preferences?

- Type: Multiple checkboxes or chips
- Options:
  - 15s short-form
  - 30s explainer
  - 1-min overview
  - Story-style (for vertical)
  - No preference

---

## ✍️ Script Preview + Editor

Once questions are answered:

- Show AI-generated prompt in a large, scrollable textarea
- Add "Copy", "Reset", and "Edit Manually" buttons
- Display confidence badge:
  - ✅ “Great start!” or
  - 🛠️ “You may want to revise tone”

> Optional: highlight specific areas with suggestions (“Consider adding a CTA”)

---

## 🚀 Finalization Step

- Click "Continue to Submit"
- Takes user to confirmation screen or inline submission view
- Prepopulates tone, format, and script into request form for final edits
- User can optionally attach brand files or notes

---

## 🧪 UX Enhancements

| Feature                  | Description                                      |
|--------------------------|--------------------------------------------------|
| Step indicator           | “Step 2 of 4” in top-left corner                 |
| Auto-save                | Save responses between steps                    |
| Back/Next navigation     | Bottom of each step (Next disabled until answered) |
| Keyboard navigation      | Tab/Enter for speed                              |
| Real-time validation     | Prevent empty answers before AI generation       |
| Dark mode support        | Yes (match marketplace UI)                      |

---

## 🎨 Visual Style

| Element     | Style Guide                     |
|-------------|----------------------------------|
| Tone chips  | Tailwind UI + icon (e.g., 🤝, 🎯, 🎙️) |
| Inputs      | Use shadcn/ui Input, Textarea    |
| Buttons     | Primary = Rose-500, Secondary = Gray-700 |
| AI section  | Rounded card with drop shadow    |
| Success toast | "AI Prompt ready. You can edit or submit." |

---

## 🧰 Engineering Considerations

- Use client-side React state to manage Q&A
- API call to `/api/generate-prompt` after last question
- Debounced save to `/api/request/draft` throughout
- Track origin of prompt (freeform vs AI) in backend for analytics

---

## 📈 Success Metrics

- % of users who finish guided builder
- % who submit without editing AI prompt
- Avg. time to submission compared to freeform

---

## ✅ Open Questions

- Should we support "regenerate prompt"?
- Should we let users upvote/downvote the generated script for future fine-tuning?
- Will different avatars offer different question templates in the future?
