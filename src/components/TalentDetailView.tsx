'use client'

import React, { useState } from 'react'
import { 
  X, 
  Edit, 
  Save, 
  CheckCircle, 
  XCircle, 
  Play, 
  Clock, 
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Video,
  Image,
  MessageSquare
} from 'lucide-react'
import { type TalentProfile, type TalentStatus } from '@/types/talent'

interface TalentDetailViewProps {
  talent: TalentProfile
  onClose: () => void
  onUpdate: (talent: TalentProfile) => Promise<void>
  onStatusChange: (talentId: string, status: TalentStatus, reason?: string) => Promise<void>
}

const statusConfig = {
  draft: { label: 'Draft', icon: Clock, color: 'text-gray-500 bg-gray-100' },
  submitted: { label: 'Submitted', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  active: { label: 'Active', icon: Play, color: 'text-blue-600 bg-blue-100' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-100' }
}

export default function TalentDetailView({
  talent,
  onClose,
  onUpdate,
  onStatusChange
}: TalentDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTalent] = useState<TalentProfile>(talent)
  const [adminNotes, setAdminNotes] = useState(talent.adminNotes || '')
  const [isSaving, setIsSaving] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updatedTalent = { ...editedTalent, adminNotes }
      await onUpdate(updatedTalent)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save talent:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: TalentStatus) => {
    if (newStatus === 'rejected') {
      setShowRejectionDialog(true)
    } else {
      await onStatusChange(talent.id, newStatus)
    }
  }

  const handleRejectionConfirm = async () => {
    await onStatusChange(talent.id, 'rejected', rejectionReason)
    setShowRejectionDialog(false)
    setRejectionReason('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusActions = () => {
    const currentStatus = talent.status
    const actions = []

    switch (currentStatus) {
      case 'draft':
        actions.push({ label: 'Mark as Submitted', status: 'submitted' as TalentStatus })
        break
      case 'submitted':
        actions.push(
          { label: 'Approve', status: 'approved' as TalentStatus },
          { label: 'Reject', status: 'rejected' as TalentStatus }
        )
        break
      case 'approved':
        actions.push(
          { label: 'Activate', status: 'active' as TalentStatus },
          { label: 'Mark as Draft', status: 'draft' as TalentStatus }
        )
        break
      case 'active':
        actions.push({ label: 'Deactivate', status: 'approved' as TalentStatus })
        break
      case 'rejected':
        actions.push(
          { label: 'Re-approve', status: 'approved' as TalentStatus },
          { label: 'Mark as Draft', status: 'draft' as TalentStatus }
        )
        break
    }

    return actions
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{talent.name}</h2>
              <p className="text-sm text-gray-500">{talent.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Personality & Tone */}
              <div className="bg-gray-50 rounded-lg p-6">
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
                      <p className="text-sm font-medium text-gray-500 mb-2">Custom Tone</p>
                      <p className="text-sm text-gray-900">{talent.customTone}</p>
                    </div>
                  )}

                  {talent.personalityTraits && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-3">Personality Traits</p>
                      <div className="space-y-2">
                        {Object.entries(talent.personalityTraits).map(([trait, value]) => (
                          <div key={trait} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 capitalize">{trait}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 w-8">{value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Media */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
                <div className="space-y-4">
                  {talent.headshots && talent.headshots.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Headshots</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {talent.headshots.map((headshot, index) => (
                          <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                            <Image className="h-6 w-6 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {talent.videoSample && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Video Sample</p>
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Interview Responses */}
              {(talent.predefinedAnswers || talent.freeformText) && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Responses</h3>
                  <div className="space-y-4">
                    {talent.predefinedAnswers && Object.entries(talent.predefinedAnswers).map(([question, answer]) => (
                      <div key={question}>
                        <p className="text-sm font-medium text-gray-500 mb-1">{question}</p>
                        <p className="text-sm text-gray-900">{answer}</p>
                      </div>
                    ))}
                    
                    {talent.freeformText && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Additional Information</p>
                        <p className="text-sm text-gray-900">{talent.freeformText}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Actions</h3>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Current Status</p>
                  {(() => {
                    const status = statusConfig[talent.status]
                    const Icon = status.icon
                    return (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        <Icon className="h-4 w-4 mr-2" />
                        {status.label}
                      </span>
                    )
                  })()}
                </div>

                <div className="space-y-2">
                  {getStatusActions().map((action) => (
                    <button
                      key={action.status}
                      onClick={() => handleStatusChange(action.status)}
                      className="w-full flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Profile Created</p>
                      <p className="text-xs text-gray-500">{formatDate(talent.createdAt)}</p>
                    </div>
                  </div>
                  
                  {talent.submittedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Submitted for Review</p>
                        <p className="text-xs text-gray-500">{formatDate(talent.submittedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {talent.approvedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Approved</p>
                        <p className="text-xs text-gray-500">{formatDate(talent.approvedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {talent.activatedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Activated</p>
                        <p className="text-xs text-gray-500">{formatDate(talent.activatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add admin notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                <div className="mt-2 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Internal notes only</span>
                </div>
              </div>

              {/* Rejection Reason */}
              {talent.rejectionReason && (
                <div className="bg-white border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Rejection Reason</h3>
                  <p className="text-sm text-red-700">{talent.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Dialog */}
      {showRejectionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Talent</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejection. This will be visible to the talent.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectionDialog(false)
                  setRejectionReason('')
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectionConfirm}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 