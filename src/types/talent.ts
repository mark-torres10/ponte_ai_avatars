export type TalentStatus = 'draft' | 'submitted' | 'approved' | 'active' | 'rejected'

export interface TalentProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  status: TalentStatus
  createdAt: string
  updatedAt: string
  submittedAt?: string
  approvedAt?: string
  activatedAt?: string
  
  // Media
  headshots?: string[]
  videoSample?: string
  
  // Personality & Tone
  toneCategories?: string[]
  personalityTraits?: {
    extroversion: number
    formality: number
    energy: number
    professionalism: number
  }
  customTone?: string
  
  // Interview
  predefinedAnswers?: Record<string, string>
  freeformText?: string
  freeformAudio?: string
  
  // Admin notes
  adminNotes?: string
  rejectionReason?: string
}

export interface TalentTableFilters {
  search: string
  status: TalentStatus | 'all'
  dateRange: {
    start: string
    end: string
  }
}

export interface BulkOperation {
  type: 'approve' | 'reject' | 'delete' | 'activate' | 'deactivate'
  talentIds: string[]
  reason?: string
} 