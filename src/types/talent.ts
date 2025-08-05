export type TalentStatus = 'draft' | 'submitted' | 'approved' | 'active' | 'inactive' | 'rejected'

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
  /**
   * Personality traits with values ranging from 0-100
   * @property {number} extroversion - Level of extroversion (0-100)
   * @property {number} formality - Level of formality in communication (0-100)
   * @property {number} energy - Energy level and enthusiasm (0-100)
   * @property {number} professionalism - Professional demeanor (0-100)
   */
  personalityTraits?: {
    extroversion: number // 0-100
    formality: number // 0-100
    energy: number // 0-100
    professionalism: number // 0-100
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