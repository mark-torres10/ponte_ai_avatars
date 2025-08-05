'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Play,
  Clock,
  AlertTriangle,
  Pause
} from 'lucide-react'
import { type TalentProfile, type TalentStatus } from '@/types/talent'
import { STATUS_CONFIG } from '@/constants/talent'
import { formatDate } from '@/utils/date'

interface TalentTableProps {
  data: TalentProfile[]
  selectedTalent: string[]
  onSelectionChange: (selected: string[]) => void
  onBulkOperation: (operation: string, talentIds: string[], reason?: string) => Promise<void>
  isLoading: boolean
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: TalentStatus | 'all'
  onStatusFilterChange: (status: TalentStatus | 'all') => void
  onViewDetails?: (talent: TalentProfile) => void
  onViewPreview?: (talent: TalentProfile) => void
}

const ITEMS_PER_PAGE = 10

export default function TalentTable({
  data,
  selectedTalent,
  onSelectionChange,
  onBulkOperation,
  isLoading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onViewDetails,
  onViewPreview
}: TalentTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [pendingOperation, setPendingOperation] = useState<{ type: string; talentIds: string[] } | null>(null)
  
  // Filter state management
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [locationFilter, setLocationFilter] = useState('')
  const [toneCategoryFilter, setToneCategoryFilter] = useState('')
  
  // Status change modal state
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedTalentForStatus, setSelectedTalentForStatus] = useState<TalentProfile | null>(null)
  const [newStatus, setNewStatus] = useState<TalentStatus>('submitted')

  // Pagination
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  
  // Apply additional filters to the data
  const filteredData = useMemo(() => {
    let filtered = data

    // Apply date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(talent => {
        const talentDate = new Date(talent.createdAt)
        const startDate = dateRange.start ? new Date(dateRange.start) : null
        const endDate = dateRange.end ? new Date(dateRange.end) : null
        
        if (startDate && endDate) {
          return talentDate >= startDate && talentDate <= endDate
        } else if (startDate) {
          return talentDate >= startDate
        } else if (endDate) {
          return talentDate <= endDate
        }
        return true
      })
    }

    // Apply location filter
    if (locationFilter.trim()) {
      filtered = filtered.filter(talent => 
        talent.location?.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Apply tone category filter
    if (toneCategoryFilter) {
      filtered = filtered.filter(talent => 
        talent.toneCategories?.includes(toneCategoryFilter)
      )
    }

    return filtered
  }, [data, dateRange, locationFilter, toneCategoryFilter])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [dateRange, locationFilter, toneCategoryFilter])

  // Update pagination based on filtered data
  const totalFilteredPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const currentData = filteredData.slice(startIndex, endIndex)

  // Selection handlers - now using global selection state
  const handleSelectAll = () => {
    const currentPageIds = currentData.map(talent => talent.id)
    const allSelected = currentPageIds.every(id => selectedTalent.includes(id))
    
    if (allSelected) {
      // Remove all current page IDs from selection
      onSelectionChange(selectedTalent.filter(id => !currentPageIds.includes(id)))
    } else {
      // Add all current page IDs to selection
      const newSelection = [...selectedTalent]
      currentPageIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id)
        }
      })
      onSelectionChange(newSelection)
    }
  }

  const handleSelectTalent = (talentId: string) => {
    if (selectedTalent.includes(talentId)) {
      onSelectionChange(selectedTalent.filter(id => id !== talentId))
    } else {
      onSelectionChange([...selectedTalent, talentId])
    }
  }

  // Bulk operation handlers
  const handleBulkAction = async (operation: string) => {
    if (selectedTalent.length === 0) return

    if (operation === 'reject') {
      setPendingOperation({ type: operation, talentIds: selectedTalent })
      setShowRejectionDialog(true)
    } else {
      await onBulkOperation(operation, selectedTalent)
      setShowBulkActions(false)
    }
  }

  const handleRejectionConfirm = async () => {
    if (pendingOperation) {
      await onBulkOperation(pendingOperation.type, pendingOperation.talentIds, rejectionReason)
      setShowRejectionDialog(false)
      setRejectionReason('')
      setPendingOperation(null)
      setShowBulkActions(false)
    }
  }

  // Fixed handleStatusChange function
  const handleStatusChange = async (talentId: string, newStatus: TalentStatus) => {
    // Map status to operation string
    const statusToOperation: Record<TalentStatus, string> = {
      'approved': 'approve',
      'rejected': 'reject',
      'active': 'activate',
      'inactive': 'deactivate',
      'submitted': 'submit', // Changed from 'approve' to 'submit'
      'draft': 'submit' // Changed from 'approve' to 'submit'
    }
    
    const operation = statusToOperation[newStatus]
    if (operation) {
      await onBulkOperation(operation, [talentId])
    }
  }

  // Action button handlers
  const handleViewClick = (talent: TalentProfile) => {
    if (onViewDetails) {
      onViewDetails(talent)
    } else {
      alert('View details feature coming soon!')
    }
  }

  const handleEditClick = (talent: TalentProfile) => {
    if (onViewDetails) {
      onViewDetails(talent)
    } else {
      alert('Edit feature coming soon!')
    }
  }

  const handleStatusChangeClick = (talent: TalentProfile) => {
    setSelectedTalentForStatus(talent)
    setNewStatus(talent.status)
    setShowStatusModal(true)
  }

  const handleStatusConfirm = async () => {
    if (selectedTalentForStatus) {
      await handleStatusChange(selectedTalentForStatus.id, newStatus)
      setShowStatusModal(false)
      setSelectedTalentForStatus(null)
    }
  }

  // Truncated pagination helper
  const getPaginationRange = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as TalentStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </button>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="mb-3">
              <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                <span className="mr-1">🔄</span>
                Filters are now functional
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="End date"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Filter by location..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone Categories</label>
                <select 
                  value={toneCategoryFilter}
                  onChange={(e) => setToneCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Categories</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="technical">Technical</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedTalent.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedTalent.length} talent selected
              </span>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showBulkActions ? 'Hide' : 'Show'} bulk actions
              </button>
            </div>
            <button
              onClick={() => onSelectionChange([])}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>

          {showBulkActions && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={isLoading}
                className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={isLoading}
                className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </button>
              <button
                onClick={() => handleBulkAction('activate')}
                disabled={isLoading}
                className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Play className="h-4 w-4 mr-1" />
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={isLoading}
                className="flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={currentData.length > 0 && currentData.every(talent => selectedTalent.includes(talent.id))}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Talent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((talent) => {
              const status = STATUS_CONFIG[talent.status]
              const Icon = status.icon
              
              return (
                <tr key={talent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTalent.includes(talent.id)}
                      onChange={() => handleSelectTalent(talent.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{talent.name}</div>
                      <div className="text-sm text-gray-500">{talent.email}</div>
                      {talent.phone && (
                        <div className="text-sm text-gray-500">{talent.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                      <Icon className="h-3 w-3 mr-1" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {talent.location || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {talent.submittedAt ? formatDate(talent.submittedAt) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {onViewPreview && (
                        <button
                          onClick={() => onViewPreview(talent)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Quick preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(talent)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View full details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      <div className="relative">
                        <button
                          onClick={() => handleStatusChangeClick(talent)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Change status"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalFilteredPages > 1 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {getPaginationRange().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? setCurrentPage(page) : null}
                  disabled={typeof page !== 'number'}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    typeof page === 'number' && currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : typeof page === 'number'
                      ? 'border-gray-300 hover:bg-gray-50'
                      : 'border-transparent cursor-default'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalFilteredPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

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
                  setPendingOperation(null)
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

      {/* Status Change Modal */}
      {showStatusModal && selectedTalentForStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Status</h3>
            <p className="text-sm text-gray-600 mb-4">
              Change status for <strong>{selectedTalentForStatus.name}</strong>
            </p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as TalentStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            >
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedTalentForStatus(null)
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusConfirm}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 