'use client'

import { useEffect, useState } from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@/types/user'

export default function ClientDashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [_userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [_error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    budget: '',
    projectType: '',
    timeline: '',
    description: ''
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/users/${user.id}`)
        const data = await response.json()

        if (data.success) {
          setUserData(data.data)
          // Remove role checking - middleware handles this
          // Just set the user data and continue
        } else {
          // User doesn't exist, but don't redirect - let middleware handle this
          setError('User data not found')
        }
      } catch (error) {
        // Error fetching user data, but don't redirect - let middleware handle this
        setError('Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchUserData()
    }
  }, [user, isLoaded, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Client onboarding form submitted:', formData)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading your client onboarding...</p>
        </div>
      </div>
    )
  }

  if (_error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">⚠️</div>
          <p className="text-destructive mb-4">{_error}</p>
          <Link href="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary">
                Ponte AI
              </Link>
              <span className="text-sm text-foreground/60">Client Onboarding</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-foreground/60">
                Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
              <SignOutButton>
                <button className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Client Onboarding Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Complete Your Client Profile
            </h1>
            <p className="text-lg text-foreground/70">
              Tell us about your company and project requirements to get started with AI avatar campaigns.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Setup Progress</span>
              <span className="text-sm text-foreground/60">Step 1 of 2</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>

          {/* Client Onboarding Form */}
          <div className="card-ponte p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-2">
                  Industry *
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select your industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="automotive">Automotive</option>
                  <option value="food-beverage">Food & Beverage</option>
                  <option value="fashion">Fashion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-2">
                  Budget Range *
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-15k">$5,000 - $15,000</option>
                  <option value="15k-50k">$15,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="over-100k">Over $100,000</option>
                </select>
              </div>

              {/* Project Type */}
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                  Project Type *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select project type</option>
                  <option value="commercial">Commercial/Advertisement</option>
                  <option value="training">Training Video</option>
                  <option value="social-media">Social Media Content</option>
                  <option value="product-launch">Product Launch</option>
                  <option value="brand-awareness">Brand Awareness</option>
                  <option value="educational">Educational Content</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Timeline */}
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium mb-2">
                  Project Timeline *
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  <option value="urgent">Urgent (1-2 weeks)</option>
                  <option value="standard">Standard (1-2 months)</option>
                  <option value="flexible">Flexible (2-6 months)</option>
                  <option value="long-term">Long-term (6+ months)</option>
                </select>
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Project Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe your project, goals, and any specific requirements..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full btn-primary-ponte py-3 rounded-md font-medium"
                >
                  Complete Profile Setup
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-foreground/60">
            <p>
              You can update your profile details later from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 