'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Users, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import TalentTable from './TalentTable'
import { type TalentProfile, type TalentStatus } from '@/types/talent'

// Mock data for development - replace with actual API calls
const mockTalentData: TalentProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    location: 'New York, NY',
    status: 'submitted',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    submittedAt: '2024-01-20T14:45:00Z',
    toneCategories: ['Professional', 'Friendly'],
    personalityTraits: {
      extroversion: 75,
      formality: 60,
      energy: 80,
      professionalism: 85
    },
    customTone: 'Warm and approachable professional'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1-555-0456',
    location: 'San Francisco, CA',
    status: 'approved',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:20:00Z',
    submittedAt: '2024-01-15T11:30:00Z',
    approvedAt: '2024-01-18T16:20:00Z',
    toneCategories: ['Corporate', 'Technical'],
    personalityTraits: {
      extroversion: 45,
      formality: 85,
      energy: 60,
      professionalism: 90
    },
    customTone: 'Clear and precise technical communicator'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1-555-0789',
    location: 'Miami, FL',
    status: 'active',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
    submittedAt: '2024-01-08T13:45:00Z',
    approvedAt: '2024-01-12T09:30:00Z',
    activatedAt: '2024-01-25T10:15:00Z',
    toneCategories: ['Casual', 'Energetic'],
    personalityTraits: {
      extroversion: 90,
      formality: 30,
      energy: 95,
      professionalism: 70
    },
    customTone: 'High-energy and engaging presenter'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1-555-0321',
    location: 'Seattle, WA',
    status: 'draft',
    createdAt: '2024-01-22T15:20:00Z',
    updatedAt: '2024-01-22T15:20:00Z',
    toneCategories: ['Academic', 'Thoughtful'],
    personalityTraits: {
      extroversion: 35,
      formality: 75,
      energy: 50,
      professionalism: 80
    },
    customTone: 'Thoughtful and analytical speaker'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+1-555-0654',
    location: 'Chicago, IL',
    status: 'rejected',
    createdAt: '2024-01-12T12:00:00Z',
    updatedAt: '2024-01-19T17:30:00Z',
    submittedAt: '2024-01-16T14:20:00Z',
    rejectionReason: 'Incomplete media uploads and poor audio quality',
    toneCategories: ['Conversational', 'Relatable'],
    personalityTraits: {
      extroversion: 65,
      formality: 40,
      energy: 70,
      professionalism: 60
    },
    customTone: 'Relatable and conversational tone'
  }
]

const statusConfig = {
  draft: { label: 'Draft', icon: Clock, color: 'text-gray-500 bg-gray-100' },
  submitted: { label: 'Submitted', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  active: { label: 'Active', icon: Users, color: 'text-blue-600 bg-blue-100' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-100' }
}

export default function AdminTalentReview() {
  const [talentData, setTalentData] = useState<TalentProfile[]>(mockTalentData)
  const [filteredData, setFilteredData] = useState<TalentProfile[]>(mockTalentData)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<TalentStatus | 'all'>('all')
  const [selectedTalent, setSelectedTalent] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
              return { ...talent, status: 'approved', updatedAt: now }
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
    } finally {
      setIsLoading(false)
    }
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
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{stats.total} Total Applications</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        />
      </div>
    </div>
  )
} 