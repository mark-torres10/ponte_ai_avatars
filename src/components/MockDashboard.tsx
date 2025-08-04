'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { TrendingUp, DollarSign, Eye, Clock, Star, Sparkles, Edit3 } from 'lucide-react'
import openAIClient, { OpenAIPersonaRequest } from '../lib/openai'

interface MockDashboardProps {
  onEditProfile?: () => void
}

interface MockEarningsData {
  totalEarnings: number
  monthlyEarnings: number
  weeklyEarnings: number
  totalViews: number
  totalLicenses: number
  averageRating: number
  activeAvatars: number
  pendingApprovals: number
}

interface MockUsageData {
  totalViews: number
  uniqueViewers: number
  averageWatchTime: number
  topPerformingAvatar: string
  recentActivity: Array<{
    id: string
    type: 'license' | 'view' | 'rating'
    description: string
    amount?: number
    timestamp: string
  }>
}

export default function MockDashboard({ onEditProfile }: MockDashboardProps) {
  const { watch } = useFormContext()
  const formData = watch()
  
  const [earningsData, setEarningsData] = useState<MockEarningsData>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    weeklyEarnings: 0,
    totalViews: 0,
    totalLicenses: 0,
    averageRating: 0,
    activeAvatars: 0,
    pendingApprovals: 0,
  })

  const [usageData, setUsageData] = useState<MockUsageData>({
    totalViews: 0,
    uniqueViewers: 0,
    averageWatchTime: 0,
    topPerformingAvatar: '',
    recentActivity: [],
  })

  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false)
  const [aiPersona, setAiPersona] = useState<string>('')
  const [personaError, setPersonaError] = useState<string>('')

  const generateMockData = useCallback(() => {
    // Generate realistic mock earnings data
    const totalEarnings = Math.floor(Math.random() * 5000) + 500
    const monthlyEarnings = Math.floor(Math.random() * 800) + 100
    const weeklyEarnings = Math.floor(Math.random() * 200) + 25
    const totalViews = Math.floor(Math.random() * 50000) + 5000
    const totalLicenses = Math.floor(Math.random() * 50) + 5
    const averageRating = (Math.random() * 2 + 3).toFixed(1) // 3.0 to 5.0
    const activeAvatars = Math.floor(Math.random() * 5) + 1
    const pendingApprovals = Math.floor(Math.random() * 3)

    setEarningsData({
      totalEarnings,
      monthlyEarnings,
      weeklyEarnings,
      totalViews,
      totalLicenses,
      averageRating: parseFloat(averageRating),
      activeAvatars,
      pendingApprovals,
    })

    // Generate mock usage data
    const uniqueViewers = Math.floor(totalViews * 0.3)
    const averageWatchTime = Math.floor(Math.random() * 120) + 30 // 30-150 seconds
    const topPerformingAvatar = formData.basicInfo?.name ? `${formData.basicInfo.name}&apos;s Professional Avatar` : 'Professional Avatar'

    const activityTypes = ['license', 'view', 'rating'] as const
    const recentActivity = Array.from({ length: 5 }, (_, i) => ({
      id: `activity-${i}`,
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      description: generateActivityDescription(activityTypes[Math.floor(Math.random() * activityTypes.length)]),
      amount: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 10 : undefined,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }))

    setUsageData({
      totalViews,
      uniqueViewers,
      averageWatchTime,
      topPerformingAvatar,
      recentActivity,
    })
  }, [formData.basicInfo?.name])

  // Generate mock data on component mount
  useEffect(() => {
    generateMockData()
  }, [generateMockData])

  const generateActivityDescription = (type: 'license' | 'view' | 'rating') => {
    const descriptions = {
      license: [
        'New license purchased for Professional Avatar',
        'Enterprise license activated for Casual Avatar',
        'Subscription renewed for Friendly Avatar',
      ],
      view: [
        'Avatar viewed by marketing agency',
        'Profile visited by content creator',
        'Sample video watched by potential client',
      ],
      rating: [
        'Received 5-star rating from client',
        'New review posted for Professional Avatar',
        'Positive feedback received from enterprise client',
      ],
    }
    return descriptions[type][Math.floor(Math.random() * descriptions[type].length)]
  }

  const generateAIPersona = async () => {
    setIsGeneratingPersona(true)
    setPersonaError('')
    
    try {
      const request: OpenAIPersonaRequest = {
        name: formData.basicInfo?.name || 'Talent',
        toneCategories: formData.personality?.toneCategories || [],
        personalityTraits: formData.personality?.personalityTraits || {
          extroversion: 50,
          formality: 50,
          energy: 50,
          professionalism: 50,
        },
        customTone: formData.personality?.customTone,
        interviewAnswers: formData.interview?.predefinedAnswers,
      }

      const response = await openAIClient.generatePersona(request)
      
      if (response.success && response.persona) {
        setAiPersona(response.persona)
      } else {
        setPersonaError(response.error || 'Failed to generate persona')
      }
    } catch (error) {
      console.error('Error generating AI persona:', error)
      setPersonaError('An unexpected error occurred')
    } finally {
      setIsGeneratingPersona(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome back, {formData.basicInfo?.name || 'Talent'}!</h1>
          <p className="text-foreground/70">Here&apos;s your profile overview and earnings summary</p>
        </div>
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="btn-secondary-ponte px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-ponte p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Earnings</p>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(earningsData.totalEarnings)}</p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm text-green-500">+12% this month</span>
          </div>
        </div>

        <div className="card-ponte p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Monthly Earnings</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(earningsData.monthlyEarnings)}</p>
            </div>
            <TrendingUp className="text-primary" size={24} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm text-green-500">+8% vs last month</span>
          </div>
        </div>

        <div className="card-ponte p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Views</p>
              <p className="text-2xl font-bold text-blue-500">{formatNumber(earningsData.totalViews)}</p>
            </div>
            <Eye className="text-blue-500" size={24} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm text-green-500">+15% this week</span>
          </div>
        </div>

        <div className="card-ponte p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-500">{earningsData.averageRating}</p>
            </div>
            <Star className="text-yellow-500" size={24} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm text-foreground/60">{earningsData.totalLicenses} licenses</span>
          </div>
        </div>
      </div>

      {/* AI Persona Generation */}
      <div className="card-ponte p-6 rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Persona</h3>
            <p className="text-foreground/70">
              Generate an AI persona description based on your profile information
            </p>
          </div>
          <button
            onClick={generateAIPersona}
            disabled={isGeneratingPersona}
            className="btn-primary-ponte px-4 py-2 rounded-md font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} />
            {isGeneratingPersona ? 'Generating...' : 'Generate Persona'}
          </button>
        </div>
        
        {personaError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <p className="text-red-500 text-sm">{personaError}</p>
          </div>
        )}
        
        {aiPersona && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Your AI Persona</h4>
            <p className="text-foreground whitespace-pre-line">{aiPersona}</p>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="card-ponte p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground/60">Active Avatars</span>
              <span className="font-medium">{earningsData.activeAvatars}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/60">Pending Approvals</span>
              <span className="font-medium">{earningsData.pendingApprovals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/60">Unique Viewers</span>
              <span className="font-medium">{formatNumber(usageData.uniqueViewers)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/60">Avg. Watch Time</span>
              <span className="font-medium">{usageData.averageWatchTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/60">Top Performer</span>
              <span className="font-medium text-sm">{usageData.topPerformingAvatar}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-ponte p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {usageData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'license' ? 'bg-green-500' :
                    activity.type === 'view' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-foreground/60">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="text-sm font-medium text-green-500">
                    +{formatCurrency(activity.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-ponte p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-secondary-ponte p-4 rounded-lg text-left">
            <div className="flex items-center gap-3">
              <Clock size={20} />
              <div>
                <p className="font-medium">View Schedule</p>
                <p className="text-sm text-foreground/60">Check upcoming sessions</p>
              </div>
            </div>
          </button>
          
          <button className="btn-secondary-ponte p-4 rounded-lg text-left">
            <div className="flex items-center gap-3">
              <Eye size={20} />
              <div>
                <p className="font-medium">View Analytics</p>
                <p className="text-sm text-foreground/60">Detailed performance data</p>
              </div>
            </div>
          </button>
          
          <button className="btn-secondary-ponte p-4 rounded-lg text-left">
            <div className="flex items-center gap-3">
              <Star size={20} />
              <div>
                <p className="font-medium">Reviews</p>
                <p className="text-sm text-foreground/60">Client feedback</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
} 