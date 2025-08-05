'use client'

import React from 'react'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Eye,
  CheckCircle, 
  XCircle, 
  Play, 
  Clock, 
  AlertTriangle,
  BarChart3
} from 'lucide-react'
import { type TalentProfile } from '@/types/talent'

interface TalentPreviewProps {
  talent: TalentProfile
  onClose: () => void
  onViewDetails: () => void
}

const statusConfig = {
  draft: { label: 'Draft', icon: Clock, color: 'text-gray-500 bg-gray-100' },
  submitted: { label: 'Submitted', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  active: { label: 'Active', icon: Play, color: 'text-blue-600 bg-blue-100' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-100' }
}

export default function TalentPreview({
  talent,
  onClose,
  onViewDetails
}: TalentPreviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const status = statusConfig[talent.status]
  const StatusIcon = status.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{talent.name}</h2>
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
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
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

            {/* Status & Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Status & Timeline</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Current Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    <StatusIcon className="h-4 w-4 mr-2" />
                    {status.label}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Profile Created</span>
                    <span className="text-gray-900">{formatDate(talent.createdAt)}</span>
                  </div>
                  
                  {talent.submittedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Submitted</span>
                      <span className="text-gray-900">{formatDate(talent.submittedAt)}</span>
                    </div>
                  )}
                  
                  {talent.approvedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Approved</span>
                      <span className="text-gray-900">{formatDate(talent.approvedAt)}</span>
                    </div>
                  )}
                  
                  {talent.activatedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Activated</span>
                      <span className="text-gray-900">{formatDate(talent.activatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personality & Tone Preview */}
          {(talent.toneCategories || talent.customTone || talent.personalityTraits) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality & Tone</h3>
              
              <div className="space-y-4">
                {talent.toneCategories && talent.toneCategories.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Tone Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {talent.toneCategories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {talent.customTone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Custom Tone</p>
                    <p className="text-sm text-gray-900">{talent.customTone}</p>
                  </div>
                )}
                
                {talent.personalityTraits && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Personality Traits</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(talent.personalityTraits).map(([trait, value]) => (
                        <div key={trait} className="flex items-center justify-between">
                          <span className="text-xs text-gray-700 capitalize">{trait}</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-6">{value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Media Preview */}
          {(talent.headshots || talent.videoSample) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
              
              <div className="space-y-3">
                {talent.headshots && talent.headshots.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Headshots ({talent.headshots.length})</p>
                    <div className="flex space-x-2">
                      {talent.headshots.slice(0, 3).map((_, index) => (
                        <div key={index} className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                      {talent.headshots.length > 3 && (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">+{talent.headshots.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {talent.videoSample && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Video Sample</p>
                    <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Notes Preview */}
          {talent.adminNotes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                {talent.adminNotes.length > 200 
                  ? `${talent.adminNotes.substring(0, 200)}...` 
                  : talent.adminNotes
                }
              </p>
            </div>
          )}

          {/* Rejection Reason */}
          {talent.rejectionReason && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Rejection Reason</h3>
              <p className="text-sm text-red-700 bg-red-50 p-3 rounded-md">
                {talent.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 