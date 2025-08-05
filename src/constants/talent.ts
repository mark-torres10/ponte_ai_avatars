import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Pause, 
  XCircle 
} from 'lucide-react'
import { type TalentStatus } from '@/types/talent'

export const STATUS_CONFIG = {
  draft: { label: 'Draft', icon: Clock, color: 'text-gray-500 bg-gray-100 border-gray-200' },
  submitted: { label: 'Submitted', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100 border-yellow-200' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100 border-green-200' },
  active: { label: 'Active', icon: Play, color: 'text-blue-600 bg-blue-100 border-blue-200' },
  inactive: { label: 'Inactive', icon: Pause, color: 'text-gray-600 bg-gray-100 border-gray-200' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-100 border-red-200' }
} as const

export type StatusConfig = typeof STATUS_CONFIG 