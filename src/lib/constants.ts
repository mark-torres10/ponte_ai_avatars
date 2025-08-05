// Shared constants for the onboarding flow

export const ONBOARDING_CONSTANTS = {
  TOTAL_STEPS: 5,
  AUTO_SAVE_INTERVAL: 3000, // 3 seconds
  INACTIVITY_TIMEOUT: 30, // 30 minutes
  DRAFT_EXPIRY_DAYS: 7, // 7 days
} as const

export const ONBOARDING_STEPS = [
  { id: 'basic-info', title: 'Basic Information' },
  { id: 'media-upload', title: 'Media Upload' },
  { id: 'tone-personality', title: 'Tone & Personality' },
  { id: 'self-interview', title: 'Self Interview' },
  { id: 'review', title: 'Review & Submit' },
] as const 