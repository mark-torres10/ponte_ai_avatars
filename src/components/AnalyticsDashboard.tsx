'use client'

import React, { useState, useMemo } from 'react'
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  AlertTriangle,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Save,
  Pause
} from 'lucide-react'
import { type TalentProfile, type TalentStatus } from '@/types/talent'
import { STATUS_CONFIG } from '@/constants/talent'

interface AnalyticsDashboardProps {
  talentData: TalentProfile[]
  onExport: (format: 'csv' | 'json', filters: Record<string, unknown>) => Promise<void>
}

interface AnalyticsMetrics {
  total: number
  draft: number
  submitted: number
  approved: number
  active: number
  inactive: number
  rejected: number
  completionRate: number
  averageTimeToSubmit: number
  averageTimeToApprove: number
  averageTimeToActivate: number
  monthlyTrends: {
    [key: string]: {
      total: number
      submitted: number
      approved: number
      active: number
    }
  }
  statusDistribution: {
    [key in TalentStatus]: number
  }
  locationDistribution: {
    [key: string]: number
  }
  toneCategoryDistribution: {
    [key: string]: number
  }
}

export default function AnalyticsDashboard({
  talentData,
  onExport
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('30d')
  const [showFilters, setShowFilters] = useState(false)
  const [savedFilters, setSavedFilters] = useState<Array<{
    id: number
    name: string
    timeRange: string
    createdAt: string
  }>>([])
  const [isExporting, setIsExporting] = useState(false)
  
  // Save filter modal state
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false)
  const [filterName, setFilterName] = useState('')

  // Calculate analytics metrics with memoization
  const metrics = useMemo(() => {
    if (!talentData.length) return null

    const filteredData = filterDataByTimeRange(talentData, timeRange)
    
    const calculatedMetrics: AnalyticsMetrics = {
      total: filteredData.length,
      draft: filteredData.filter(t => t.status === 'draft').length,
      submitted: filteredData.filter(t => t.status === 'submitted').length,
      approved: filteredData.filter(t => t.status === 'approved').length,
      active: filteredData.filter(t => t.status === 'active').length,
      inactive: filteredData.filter(t => t.status === 'inactive').length,
      rejected: filteredData.filter(t => t.status === 'rejected').length,
      completionRate: calculateCompletionRate(filteredData),
      averageTimeToSubmit: calculateAverageTimeToSubmit(filteredData),
      averageTimeToApprove: calculateAverageTimeToApprove(filteredData),
      averageTimeToActivate: calculateAverageTimeToActivate(filteredData),
      monthlyTrends: calculateMonthlyTrends(filteredData),
      statusDistribution: calculateStatusDistribution(filteredData),
      locationDistribution: calculateLocationDistribution(filteredData),
      toneCategoryDistribution: calculateToneCategoryDistribution(filteredData)
    }

    return calculatedMetrics
  }, [talentData, timeRange])

  const filterDataByTimeRange = (data: TalentProfile[], range: string): TalentProfile[] => {
    const now = new Date()
    const cutoffDate = new Date()

    switch (range) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case '30d':
        cutoffDate.setDate(now.getDate() - 30)
        break
      case '90d':
        cutoffDate.setDate(now.getDate() - 90)
        break
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return data
    }

    return data.filter(talent => new Date(talent.createdAt) >= cutoffDate)
  }

  const calculateCompletionRate = (data: TalentProfile[]): number => {
    const completed = data.filter(t => t.status === 'active').length
    return data.length > 0 ? Math.round((completed / data.length) * 100) : 0
  }

  const calculateAverageTimeToSubmit = (data: TalentProfile[]): number => {
    const submittedData = data.filter(t => t.submittedAt)
    if (submittedData.length === 0) return 0

    const totalDays = submittedData.reduce((sum, talent) => {
      const created = new Date(talent.createdAt)
      const submitted = new Date(talent.submittedAt!)
      return sum + (submitted.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    }, 0)

    return Math.round(totalDays / submittedData.length)
  }

  const calculateAverageTimeToApprove = (data: TalentProfile[]): number => {
    const approvedData = data.filter(t => t.approvedAt && t.submittedAt)
    if (approvedData.length === 0) return 0

    const totalDays = approvedData.reduce((sum, talent) => {
      const submitted = new Date(talent.submittedAt!)
      const approved = new Date(talent.approvedAt!)
      return sum + (approved.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24)
    }, 0)

    return Math.round(totalDays / approvedData.length)
  }

  const calculateAverageTimeToActivate = (data: TalentProfile[]): number => {
    const activatedData = data.filter(t => t.activatedAt && t.approvedAt)
    if (activatedData.length === 0) return 0

    const totalDays = activatedData.reduce((sum, talent) => {
      const approved = new Date(talent.approvedAt!)
      const activated = new Date(talent.activatedAt!)
      return sum + (activated.getTime() - approved.getTime()) / (1000 * 60 * 60 * 24)
    }, 0)

    return Math.round(totalDays / activatedData.length)
  }

  const calculateMonthlyTrends = (data: TalentProfile[]) => {
    const trends: { [key: string]: {
      total: number
      submitted: number
      approved: number
      active: number
    } } = {}
    
    data.forEach(talent => {
      const month = new Date(talent.createdAt).toISOString().slice(0, 7) // YYYY-MM
      if (!trends[month]) {
        trends[month] = { total: 0, submitted: 0, approved: 0, active: 0 }
      }
      
      trends[month].total++
      if (talent.submittedAt) trends[month].submitted++
      if (talent.approvedAt) trends[month].approved++
      if (talent.activatedAt) trends[month].active++
    })

    return trends
  }

  const calculateStatusDistribution = (data: TalentProfile[]) => {
    const distribution: { [key in TalentStatus]: number } = {
      draft: 0,
      submitted: 0,
      approved: 0,
      active: 0,
      inactive: 0,
      rejected: 0
    }

    data.forEach(talent => {
      distribution[talent.status]++
    })

    return distribution
  }

  const calculateLocationDistribution = (data: TalentProfile[]) => {
    const distribution: { [key: string]: number } = {}
    
    data.forEach(talent => {
      if (talent.location) {
        distribution[talent.location] = (distribution[talent.location] || 0) + 1
      }
    })

    return distribution
  }

  const calculateToneCategoryDistribution = (data: TalentProfile[]) => {
    const distribution: { [key: string]: number } = {}
    
    data.forEach(talent => {
      if (talent.toneCategories) {
        talent.toneCategories.forEach(category => {
          distribution[category] = (distribution[category] || 0) + 1
        })
      }
    })

    return distribution
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true)
    try {
      await onExport(format, { timeRange })
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleSavedFilterChange = (filterId: string) => {
    const filter = savedFilters.find(f => f.id.toString() === filterId)
    if (filter) {
      setTimeRange(filter.timeRange)
    }
  }

  const saveFilter = () => {
    setShowSaveFilterModal(true)
  }

  const handleSaveFilterConfirm = () => {
    if (filterName.trim()) {
      const newFilter = {
        id: Date.now(),
        name: filterName.trim(),
        timeRange,
        createdAt: new Date().toISOString()
      }
      setSavedFilters([...savedFilters, newFilter])
      setFilterName('')
      setShowSaveFilterModal(false)
    }
  }

  const handleSaveFilterCancel = () => {
    setFilterName('')
    setShowSaveFilterModal(false)
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">
            Insights into talent onboarding pipeline performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </button>
          <button
            onClick={saveFilter}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Filter
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
            
            {savedFilters.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saved Filters</label>
                <select
                  value={savedFilters.find(f => f.timeRange === timeRange)?.id.toString()}
                  onChange={(e) => handleSavedFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a saved filter</option>
                  {savedFilters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Applications</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Time to Submit</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.averageTimeToSubmit}d</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Time to Approve</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.averageTimeToApprove}d</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(metrics.statusDistribution).map(([status, count]) => {
              const config = STATUS_CONFIG[status as TalentStatus]
              const percentage = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0
              const Icon = config.icon
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{config.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Location Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
          <div className="space-y-3">
            {Object.entries(metrics.locationDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([location, count]) => (
                <div key={location} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{location}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(count / metrics.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Tone Categories */}
      {Object.keys(metrics.toneCategoryDistribution).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tone Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics.toneCategoryDistribution)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-sm text-gray-500">{category}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-500">Month</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Submitted</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Approved</th>
                <th className="text-left py-2 text-sm font-medium text-gray-500">Active</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(metrics.monthlyTrends)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([month, data]) => (
                  <tr key={month} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-900">{month}</td>
                    <td className="py-2 text-sm text-gray-900">{data.total}</td>
                    <td className="py-2 text-sm text-gray-900">{data.submitted}</td>
                    <td className="py-2 text-sm text-gray-900">{data.approved}</td>
                    <td className="py-2 text-sm text-gray-900">{data.active}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Filter Modal */}
      {showSaveFilterModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 border w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex justify-between items-start p-4 rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Save Filter
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={handleSaveFilterCancel}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700">Filter Name</label>
                  <input
                    type="text"
                    id="filter-name"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Current Month Applications"
                  />
                </div>
              </div>
              <div className="flex items-center p-6 space-x-2 rounded-b dark:border-gray-600">
                <button
                  onClick={handleSaveFilterConfirm}
                  className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Save Filter
                </button>
                <button
                  onClick={handleSaveFilterCancel}
                  className="text-gray-500 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 