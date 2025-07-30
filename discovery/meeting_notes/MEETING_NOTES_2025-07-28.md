# Meeting Notes - July 28, 2025

## Agenda Items

### Topics to Cover
- Proposed outline
- Required tools and accounts

### Required Tools & Services
- **ChatGPT** - AI script processing
- **ElevenLabs** - Voice generation
- **D-ID** - Avatar video generation
- **Vercel** - Hosting and deployment
- **Supabase** - Database and backend

### Proposed weekly budget for tooling
- **Upper limit**: $100
- **Likely usage**: $50 (or less)

### Payment & Account Options
1. Provide accounts for all services
2. Company card for expenses
3. Itemized invoice (recommended)

---

## AI Avatar MVP - 8-Week Development Plan

**Total Effort:** 160 hours

**Goal:** Deliver an investor-ready MVP where users can browse AI avatars, submit video request scripts, and receive generated AI videos based on brand-approved messaging. The product will be embeddable into the Lovable website and include internal approval flows.
### Week 1 – Core Avatar Pipeline
- Build the full pipeline: user-provided script → GPT prompt cleanup → ElevenLabs voice generation → D-ID avatar video generation
- Hardcode test avatar and prompt to validate the full stack
- Deploy internal test demo
- Share Vercel link in Slack for early feedback

**Deliverable:** Script-to-video working flow (user enters prompt → avatar video generated)
- **Slack Checkpoint:** Share demo + test outputs for tone and realism

### Week 2 – Request Form UI + Demo Avatar Selection
- Build request flow: user browses demo avatars → selects one → submits video request form
- Form includes: script prompt, desired tone, and use case (e.g. Zillow listing, testimonial)
- Implement tone presets (e.g. “casual”, “friendly”, “confident”)
- Use a static test avatar during Week 2

**Deliverable:** Full script submission flow with UI + sample outputs
- **Slack Checkpoint:** Share video request submission flow + test video

### Week 3 – Onboarding Flow for Talent (Avatar Creation)
- Build internal onboarding form for adding new avatars
- Upload headshot or video sample
- Provide tone descriptors and optional self-interview
- Store client metadata (e.g. tone, preferred topics, voice config)
- Prepare mock dashboard to view onboarded talent

**Deliverable:** Flow to onboard a new talent (creator/client) into the system
- **Slack Checkpoint:** Loom showing onboarding form + test talent profile

### Week 4 – Internal Pre-Generation Review Dashboard (Manual)
- Build dashboard to view incoming script submissions
- Allow team to approve, reject, or flag for compliance
- Store request status (pending, approved, rejected)
- Add manual Slack/email notifications for now

**Deliverable:** Admin dashboard for reviewing and approving requests
- **Slack Checkpoint:** Screenshare or Loom of review flow

### Week 5 – AI Script Review + Auto-Generation Logic
- Add GPT-based screening layer for pre-checking tone, topics, and flagged content
- If safe, AI rewrites script to match avatar tone
- Automatically generate audio + video if approved
- Support fallback to manual override/edit

**Deliverable:** AI-assisted script moderation and auto-generation logic
- **Slack Checkpoint:** Share example of full request → AI filtered → video flow

### Week 6 – Full Approval Chain Logic (Backend)
- Build flow for:
  - Internal pre-approval
  - Talent-side final approval (simulated with manual email for now)
- Only generate videos if both steps pass
- Add logic to hold/queue requests pending human review

**Deliverable:** Full 2-stage approval pipeline (internal + talent)
- **Slack Checkpoint:** Share diagram + working example

### Week 7 – Embed Widget + Demo Packaging
- Build simple iframe/embed code for Lovable site integration
- Polish UI for submission flow and viewer experience
- Record demo videos (avatar showcase, full request → approval → output flow)

**Deliverable:** Final embeddable widget + polished user-facing UX
- **Slack Checkpoint:** Share final demo videos + embed snippet

### Week 8 – QA, Handoff, and Documentation
- Run usability testing, fix edge cases
- Finalize documentation: usage, avatar onboarding, approval flows
- Deliver GitHub codebase, walkthrough Looms, and roadmap for next steps

**Deliverable:** Complete MVP ready to use and demo
- **Slack Checkpoint:** Final message with links to code, demo, docs, and next steps

## Meeting notes
- Weekly touchpoint + recap email. Meeting on Friday morning.
- TODO: Sign into Microsoft Teams (I got access)
- Just put things on my card for now. They'll get me a credit card later.
- AI avatar should refine itself as it gets more information from the person. They're more interested in "making the AI more like the person" over time.
- Friday 8am recurring recaps. 15 minutes, pretty quick.
- Two use cases: can be popular person with a lot of online content, but can also be a person that doesn't have a big online presence (and so we can ask them to interview themselves, for examples).
- They'll give me examples of possible clients as well as examples of possible requests.
- TODO: set up accounts for all the services.

## Follow-ups
- Get added to Teams.
- Set up accounts using PonteAI email: ChatGPT, ElevenLabs, D-ID, Vercel, Supabase
- Update prototype:
    - Remove chat functionality
    - Just have a simple textbox that takes as input the text to say.
    - Then, have a persona carousel, where the user can pick which person they want to be able to say the content. Each card should have name, bio, picture, and voice sample.
    - Then the output is a video of a person saying the thing.
    - Also add caching so that I don't have to rack up costs. Also can store stuff in Supabase (e.g., to avoid duplicate requests).

