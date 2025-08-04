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

  // Calculate base multiplier based on user's personality and tone
  const calculateBaseMultiplier = useCallback(() => {
    const userPersonality = formData.personality?.personalityTraits
    const userTones = formData.personality?.toneCategories || []
    
    let baseMultiplier = 1
    if (userTones.includes('Professional')) baseMultiplier += 0.5
    if (userTones.includes('Educational')) baseMultiplier += 0.3
    if (userTones.includes('Motivational')) baseMultiplier += 0.4
    if (userPersonality?.professionalism && userPersonality.professionalism > 70) baseMultiplier += 0.3
    
    return baseMultiplier
  }, [formData.personality?.personalityTraits, formData.personality?.toneCategories])

  const generateDreamData = useCallback(() => {
    // Generate aspirational dream earnings data based on user's profile
    const baseMultiplier = calculateBaseMultiplier()
    
    // Generate dream earnings data
    const totalEarnings = Math.floor((Math.random() * 15000 + 8000) * baseMultiplier)
    const monthlyEarnings = Math.floor((Math.random() * 3000 + 1500) * baseMultiplier)
    const weeklyEarnings = Math.floor((Math.random() * 800 + 400) * baseMultiplier)
    const totalViews = Math.floor((Math.random() * 150000 + 50000) * baseMultiplier)
    const totalLicenses = Math.floor((Math.random() * 120 + 30) * baseMultiplier)
    const averageRating = (Math.random() * 1.5 + 4.2).toFixed(1) // 4.2 to 5.7
    const activeAvatars = Math.floor(Math.random() * 8) + 3
    const pendingApprovals = Math.floor(Math.random() * 5) + 1

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

    // Generate dream usage data
    const uniqueViewers = Math.floor(totalViews * 0.4)
    const averageWatchTime = Math.floor(Math.random() * 180) + 60 // 60-240 seconds
    const topPerformingAvatar = formData.basicInfo?.name ? `${formData.basicInfo.name}'s Premium Avatar` : 'Premium Professional Avatar'

    const activityTypes = ['license', 'view', 'rating'] as const
    const recentActivity = Array.from({ length: 8 }, (_, i) => ({
      id: `activity-${i}`,
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      description: generateDreamActivityDescription(activityTypes[Math.floor(Math.random() * activityTypes.length)]),
      amount: Math.random() > 0.3 ? Math.floor(Math.random() * 500 + 100) : undefined,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }))

    setUsageData({
      totalViews,
      uniqueViewers,
      averageWatchTime,
      topPerformingAvatar,
      recentActivity,
    })
  }, [formData.basicInfo?.name, calculateBaseMultiplier])

  // Generate dream data on component mount
  useEffect(() => {
    generateDreamData()
  }, [generateDreamData])

  const generateDreamActivityDescription = (type: 'license' | 'view' | 'rating') => {
    const descriptions = {
      license: [
        'Enterprise license purchased for Premium Avatar',
        'Multi-year contract signed for Professional Avatar',
        'Global brand licensing deal activated',
        'Corporate training program subscription',
        'International marketing campaign license',
      ],
      view: [
        'Avatar featured in Fortune 500 company presentation',
        'Profile viewed by major tech corporation',
        'Sample video watched by Fortune 100 client',
        'Avatar selected for national advertising campaign',
        'Profile visited by international brand',
      ],
      rating: [
        'Received 5-star rating from Fortune 500 client',
        'New glowing review from enterprise customer',
        'Perfect score from international brand',
        'Featured in client success story',
        'Recognized as top-performing talent',
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
      {/* Dream Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            🚀 Your Dream Dashboard
          </h1>
          <p className="text-lg text-foreground/70 mb-1">
            This is what your success could look like, {formData.basicInfo?.name || 'Talent'}!
          </p>
          <p className="text-sm text-green-400 font-medium">
            ✨ Based on your profile, here&apos;s your earning potential
          </p>
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

      {/* Dream Earnings Potential */}
      <div className="card-ponte p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg mb-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-green-400 mb-2">💫 Your Earning Potential</h2>
          <p className="text-foreground/70">
            Based on similar talent profiles, here&apos;s what you could be earning:
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">1 Month</div>
            <div className="text-lg font-semibold">{formatCurrency(earningsData.monthlyEarnings)}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">3 Months</div>
            <div className="text-lg font-semibold">{formatCurrency(earningsData.monthlyEarnings * 3)}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">6 Months</div>
            <div className="text-lg font-semibold">{formatCurrency(earningsData.monthlyEarnings * 6)}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">1 Year</div>
            <div className="text-lg font-semibold">{formatCurrency(earningsData.monthlyEarnings * 12)}</div>
          </div>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-ponte p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Earnings</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(earningsData.totalEarnings)}</p>
            </div>
            <DollarSign className="text-green-400" size={24} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-sm text-green-400">+45% this month</span>
          </div>
        </div>

        <div className="card-ponte p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Monthly Earnings</p>
              <p className="text-2xl font-bold text-blue-400">{formatCurrency(earningsData.monthlyEarnings)}</p>
            </div>
            <TrendingUp className="text-blue-400" size={24} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-sm text-green-400">+28% vs last month</span>
          </div>
        </div>

        <div className="card-ponte p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Views</p>
              <p className="text-2xl font-bold text-purple-400">{formatNumber(earningsData.totalViews)}</p>
            </div>
            <Eye className="text-purple-400" size={24} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-sm text-green-400">+35% this week</span>
          </div>
        </div>

        <div className="card-ponte p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-400">{earningsData.averageRating}</p>
            </div>
            <Star className="text-yellow-400" size={24} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm text-foreground/60">{earningsData.totalLicenses} licenses</span>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="card-ponte p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-purple-400 mb-2">🌟 Success Stories</h3>
          <p className="text-foreground/70">
            Real talent like you are already achieving these results
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl mb-2">👨‍💼</div>
            <h4 className="font-semibold mb-1">Professional Speaker</h4>
            <p className="text-sm text-foreground/60 mb-2">Corporate training expert</p>
            <p className="text-lg font-bold text-green-400">$8,500/month</p>
            <p className="text-xs text-foreground/50">Started 6 months ago</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl mb-2">👩‍🏫</div>
            <h4 className="font-semibold mb-1">Educational Creator</h4>
            <p className="text-sm text-foreground/60 mb-2">Online course instructor</p>
            <p className="text-lg font-bold text-green-400">$12,200/month</p>
            <p className="text-xs text-foreground/50">Started 1 year ago</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold mb-1">Motivational Coach</h4>
            <p className="text-sm text-foreground/60 mb-2">Life transformation expert</p>
            <p className="text-lg font-bold text-green-400">$15,800/month</p>
            <p className="text-xs text-foreground/50">Started 8 months ago</p>
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
        <div className="card-ponte p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">📊 Your Performance Metrics</h3>
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
        <div className="card-ponte p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <h3 className="text-lg font-semibold mb-4 text-green-400">🔥 Recent Success</h3>
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
      <div className="card-ponte p-6 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
        <h3 className="text-lg font-semibold mb-4 text-yellow-400">⚡ Ready to Scale Up?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-secondary-ponte p-4 rounded-lg text-left hover:bg-green-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-green-400" />
              <div>
                <p className="font-medium">Book More Sessions</p>
                <p className="text-sm text-foreground/60">Increase your earning potential</p>
              </div>
            </div>
          </button>
          
          <button className="btn-secondary-ponte p-4 rounded-lg text-left hover:bg-blue-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-blue-400" />
              <div>
                <p className="font-medium">Track Growth</p>
                <p className="text-sm text-foreground/60">Monitor your success metrics</p>
              </div>
            </div>
          </button>
          
          <button className="btn-secondary-ponte p-4 rounded-lg text-left hover:bg-purple-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <Star size={20} className="text-purple-400" />
              <div>
                <p className="font-medium">Client Reviews</p>
                <p className="text-sm text-foreground/60">See what clients are saying</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
} 