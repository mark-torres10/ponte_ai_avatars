'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { type TalentProfile, type TalentStatus } from '@/types/talent'

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
}

const statusConfig = {
  draft: { label: 'Draft', icon: Clock, color: 'text-gray-500 bg-gray-100 border-gray-200' },
  submitted: { label: 'Submitted', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100 border-yellow-200' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100 border-green-200' },
  active: { label: 'Active', icon: Play, color: 'text-blue-600 bg-blue-100 border-blue-200' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-100 border-red-200' }
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
  onStatusFilterChange
}: TalentTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [pendingOperation, setPendingOperation] = useState<{ type: string; talentIds: string[] } | null>(null)

  // Pagination
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = data.slice(startIndex, endIndex)

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedTalent.length === currentData.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(currentData.map(talent => talent.id))
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

  const handleStatusChange = async (talentId: string, newStatus: TalentStatus) => {
    await onBulkOperation(newStatus, [talentId])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
              {Object.entries(statusConfig).map(([key, config]) => (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="End date"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Filter by location..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone Categories</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
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
                  checked={selectedTalent.length === currentData.length && currentData.length > 0}
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
              const status = statusConfig[talent.status]
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
                      <button
                        onClick={() => {/* View details */}}
                        className="text-blue-600 hover:text-blue-900"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Edit */}}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => {/* Status dropdown */}}
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
      {totalPages > 1 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
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
    </div>
  )
} 