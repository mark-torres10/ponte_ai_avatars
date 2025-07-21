# 🧭 PonteAI User Journey Diagram (MVP Flow)

```mermaid
flowchart TD
  A[User lands on site] --> B[Clicks "Login"]
  B --> C[Auth via email/social login]
  C --> D[Redirected to Avatar Marketplace]

  D --> E[User browses Talent Cards]
  E --> F[User uses filters or search (Tone, Tier)]
  F --> G[Clicks on an Avatar Card]

  G --> H[Avatar Detail Page]
  H --> I[User clicks "Request Avatar"]

  I --> J{Choose Request Mode}
  J --> J1[Freeform Prompt]
  J --> J2[AI-Guided Prompt Builder]

  J1 --> K[User types custom script]
  J2 --> L[User answers questions (tone, audience, intent)]
  L --> M[AI generates script preview]
  M --> N[User edits preview if desired]

  K --> O[User clicks Submit Request]
  N --> O

  O --> P[Global toast: "Request submitted"]
  P --> Q[Redirected to Dashboard]

  Q --> R[Sees request in "Pending Review"]
  R --> S[Internal Review: Approve/Reject]
  S --> T[Talent Team Review: Approve/Reject]

  T --> U{Final Outcome}
  U --> U1[Approved → Delivery in Progress]
  U --> U2[Rejected → User can revise and resubmit]

  U2 --> Q
```
