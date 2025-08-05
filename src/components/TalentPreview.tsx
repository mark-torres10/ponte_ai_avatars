'use client'

import { useEffect, useRef } from 'react'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Eye,
  Image,
  Video
} from 'lucide-react'
import { type TalentProfile } from '@/types/talent'
import { STATUS_CONFIG } from '@/constants/talent'
import { formatDate } from '@/utils/date'

interface TalentPreviewProps {
  talent: TalentProfile
  onClose: () => void
  onViewDetails: () => void
}

export default function TalentPreview({
  talent,
  onClose,
  onViewDetails
}: TalentPreviewProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Focus management
  useEffect(() => {
    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement
    
    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus()
    }

    // Cleanup function to restore focus
    return () => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [])

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
      
      // Trap focus within modal
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
          
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault()
              lastElement.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault()
              firstElement.focus()
            }
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const status = STATUS_CONFIG[talent.status]
  const StatusIcon = status.icon

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="talent-preview-title"
      aria-describedby="talent-preview-content"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 id="talent-preview-title" className="text-xl font-bold text-gray-900">{talent.name}</h2>
              <p className="text-sm text-gray-500">{talent.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onViewDetails}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </button>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div id="talent-preview-content" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{talent.email}</p>
                  </div>
                </div>
                
                {talent.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{talent.phone}</p>
                    </div>
                  </div>
                )}
                
                {talent.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-sm text-gray-900">{talent.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(talent.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Status & Timeline</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {status.label}
                  </span>
                </div>
                
                {talent.submittedAt && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submitted</p>
                      <p className="text-sm text-gray-900">{formatDate(talent.submittedAt)}</p>
                    </div>
                  </div>
                )}
                
                {talent.approvedAt && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Approved</p>
                      <p className="text-sm text-gray-900">{formatDate(talent.approvedAt)}</p>
                    </div>
                  </div>
                )}
                
                {talent.activatedAt && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Activated</p>
                      <p className="text-sm text-gray-900">{formatDate(talent.activatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personality & Tone */}
          {talent.personalityTraits && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality & Tone</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-500">Extroversion</p>
                  <p className="text-lg font-semibold text-gray-900">{talent.personalityTraits.extroversion}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-500">Formality</p>
                  <p className="text-lg font-semibold text-gray-900">{talent.personalityTraits.formality}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-500">Energy</p>
                  <p className="text-lg font-semibold text-gray-900">{talent.personalityTraits.energy}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-500">Professionalism</p>
                  <p className="text-lg font-semibold text-gray-900">{talent.personalityTraits.professionalism}%</p>
                </div>
              </div>
              
              {talent.toneCategories && talent.toneCategories.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Tone Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {talent.toneCategories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {talent.customTone && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Custom Tone</p>
                  <p className="text-sm text-gray-900">{talent.customTone}</p>
                </div>
              )}
            </div>
          )}

          {/* Media */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Headshots */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Image className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500">Headshots</p>
                </div>
                {talent.headshots && talent.headshots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {talent.headshots.slice(0, 4).map((headshot, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No headshots uploaded</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Sample */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500">Video Sample</p>
                </div>
                {talent.videoSample ? (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No video sample uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {talent.adminNotes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900">{talent.adminNotes}</p>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {talent.rejectionReason && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejection Reason</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{talent.rejectionReason}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 