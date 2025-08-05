'use client'

import React, { useState, useEffect } from 'react'
import { Users, AlertTriangle, CheckCircle, Clock, XCircle, BarChart3, Pause } from 'lucide-react'
import TalentTable from './TalentTable'
import TalentDetailView from './TalentDetailView'
import TalentPreview from './TalentPreview'
import AnalyticsDashboard from './AnalyticsDashboard'
import { type TalentProfile, type TalentStatus } from '@/types/talent'
import { mockTalentData } from '@/lib/mockData'

const statusConfig = {
  draft: { label: 'Draft', icon: Clock, color: 'text-gray-500 bg-gray-100' },
  submitted: { label: 'Submitted', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  active: { label: 'Active', icon: Users, color: 'text-blue-600 bg-blue-100' },
  inactive: { label: 'Inactive', icon: Pause, color: 'text-gray-600 bg-gray-100' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-100' }
}

export default function AdminTalentReview() {
  const [talentData, setTalentData] = useState<TalentProfile[]>(mockTalentData)
  const [filteredData, setFilteredData] = useState<TalentProfile[]>(mockTalentData)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<TalentStatus | 'all'>('all')
  const [selectedTalent, setSelectedTalent] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTalentForDetail, setSelectedTalentForDetail] = useState<TalentProfile | null>(null)
  const [selectedTalentForPreview, setSelectedTalentForPreview] = useState<TalentProfile | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  // Error state management
  const [operationError, setOperationError] = useState<string | null>(null)

  // Calculate statistics
  const stats = {
    total: talentData.length,
    draft: talentData.filter(t => t.status === 'draft').length,
    submitted: talentData.filter(t => t.status === 'submitted').length,
    approved: talentData.filter(t => t.status === 'approved').length,
    active: talentData.filter(t => t.status === 'active').length,
    rejected: talentData.filter(t => t.status === 'rejected').length
  }

  // Filter data based on search and status
  useEffect(() => {
    let filtered = talentData

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(talent =>
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(talent => talent.status === statusFilter)
    }

    setFilteredData(filtered)
  }, [talentData, searchTerm, statusFilter])

  const handleBulkOperation = async (operation: string, talentIds: string[], reason?: string) => {
    setIsLoading(true)
    setOperationError(null) // Clear previous errors
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTalentData(prev => prev.map(talent => {
        if (talentIds.includes(talent.id)) {
          const now = new Date().toISOString()
          switch (operation) {
            case 'approve':
              return { ...talent, status: 'approved', approvedAt: now, updatedAt: now }
            case 'reject':
              return { ...talent, status: 'rejected', rejectionReason: reason, updatedAt: now }
            case 'activate':
              return { ...talent, status: 'active', activatedAt: now, updatedAt: now }
            case 'deactivate':
              return { ...talent, status: 'inactive', updatedAt: now }
            case 'delete':
              return talent // Will be filtered out
            default:
              return talent
          }
        }
        return talent
      }))
      
      // Remove deleted items
      if (operation === 'delete') {
        setTalentData(prev => prev.filter(talent => !talentIds.includes(talent.id)))
      }
      
      setSelectedTalent([])
    } catch (error) {
      console.error('Bulk operation failed:', error)
      setOperationError(error instanceof Error ? error.message : 'An unexpected error occurred during the bulk operation.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTalentUpdate = async (updatedTalent: TalentProfile) => {
    setTalentData(prev => prev.map(talent => 
      talent.id === updatedTalent.id ? updatedTalent : talent
    ))
  }

  const handleStatusChange = async (talentId: string, status: TalentStatus, reason?: string) => {
    const now = new Date().toISOString()
    setTalentData(prev => prev.map(talent => {
      if (talent.id === talentId) {
        const updates: Partial<TalentProfile> = { status, updatedAt: now }
        if (status === 'approved') updates.approvedAt = now
        if (status === 'active') updates.activatedAt = now
        if (status === 'rejected' && reason) updates.rejectionReason = reason
        return { ...talent, ...updates }
      }
      return talent
    }))
  }

  const handleExport = async (format: 'csv' | 'json', filters: Record<string, unknown>) => {
    // Simulate export functionality
    console.log(`Exporting ${format} with filters:`, filters)
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert(`${format.toUpperCase()} export completed!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Talent Review Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and review onboarded talent applications
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{stats.total} Total Applications</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {operationError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Operation Failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{operationError}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setOperationError(null)}
                    className="text-sm font-medium text-red-800 hover:text-red-900"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Object.entries(stats).map(([key, value]) => {
            if (key === 'total') return null
            const config = statusConfig[key as TalentStatus]
            const Icon = config.icon
            
            return (
              <div key={key} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">{config.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnalyticsDashboard
            talentData={talentData}
            onExport={handleExport}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TalentTable
          data={filteredData}
          selectedTalent={selectedTalent}
          onSelectionChange={setSelectedTalent}
          onBulkOperation={handleBulkOperation}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onViewDetails={(talent) => setSelectedTalentForDetail(talent)}
          onViewPreview={(talent) => setSelectedTalentForPreview(talent)}
        />
      </div>

      {/* Talent Detail View Modal */}
      {selectedTalentForDetail && (
        <TalentDetailView
          talent={selectedTalentForDetail}
          onClose={() => setSelectedTalentForDetail(null)}
          onUpdate={handleTalentUpdate}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Talent Preview Modal */}
      {selectedTalentForPreview && (
        <TalentPreview
          talent={selectedTalentForPreview}
          onClose={() => setSelectedTalentForPreview(null)}
          onViewDetails={() => {
            setSelectedTalentForPreview(null)
            setSelectedTalentForDetail(selectedTalentForPreview)
          }}
        />
      )}
    </div>
  )
} 