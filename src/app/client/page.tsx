'use client'

import { useEffect, useState } from 'react'
import { SignOutButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useClerkUser } from '@/lib/useClerkUser'

export default function ClientDashboardPage() {
  const { user, isLoaded } = useClerkUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
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
          // Remove role checking - middleware handles this
          // Just set the user data and continue
        } else {
          // User doesn't exist, but don't redirect - let middleware handle this
          setError('User data not found')
        }
      } catch {
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
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Handle form submission logic here
      console.log('Client onboarding form submitted:', formData)
      
      // Move to next step
      setCurrentStep(2)
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">⚠️</div>
          <p className="text-destructive mb-4">{error}</p>
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
              {currentStep === 1 ? 'Complete Your Client Profile' : 'Profile Submitted Successfully!'}
            </h1>
            <p className="text-lg text-foreground/70">
              {currentStep === 1 
                ? 'Tell us about your company and project requirements to get started with AI avatar campaigns.'
                : 'Thank you for completing your client profile. Our team will review your application and get back to you within 2-3 business days.'
              }
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Setup Progress</span>
              <span className="text-sm text-foreground/60">
                Step {currentStep} of 2
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 ? (
            /* Step 1: Client Onboarding Form */
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
                    disabled={isSubmitting}
                    className="w-full btn-primary-ponte py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Complete Profile Setup'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Step 2: Submission Confirmation and Dashboard Preview */
            <div className="space-y-8">
              {/* Submission Confirmation */}
              <div className="card-ponte p-8 rounded-lg border-2 border-green-500/20 bg-green-500/5">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎉</div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-600 mb-2">What happens next?</h3>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>• Our team reviews your project requirements</li>
                      <li>• We match you with suitable AI avatar talent</li>
                      <li>• You&apos;ll receive a personalized proposal</li>
                      <li>• Schedule a consultation call to discuss details</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sample Dashboard Preview */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Your Future Dashboard Preview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Collaboration Opportunities */}
                  <div className="card-ponte p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <span className="text-blue-500 mr-2">🤝</span>
                      Collaboration Opportunities
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium">Sarah Johnson</p>
                          <p className="text-sm text-foreground/60">Tech Influencer</p>
                        </div>
                        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">
                          Perfect Match
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium">Mike Chen</p>
                          <p className="text-sm text-foreground/60">Business Coach</p>
                        </div>
                        <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-1 rounded-full">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Management */}
                  <div className="card-ponte p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <span className="text-purple-500 mr-2">📊</span>
                      Project Overview
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Projects</span>
                        <span className="font-semibold text-green-600">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completed Campaigns</span>
                        <span className="font-semibold text-blue-600">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Investment</span>
                        <span className="font-semibold text-purple-600">$45,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ROI Average</span>
                        <span className="font-semibold text-green-600">+340%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="card-ponte p-6 rounded-lg md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <span className="text-orange-500 mr-2">📈</span>
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Campaign &quot;TechLaunch 2024&quot; went live</p>
                          <p className="text-sm text-foreground/60">2 hours ago</p>
                        </div>
                        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">
                          Live
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">New proposal received from Sarah Johnson</p>
                          <p className="text-sm text-foreground/60">1 day ago</p>
                        </div>
                        <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-1 rounded-full">
                          Review
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Consultation call scheduled with Mike Chen</p>
                          <p className="text-sm text-foreground/60">2 days ago</p>
                        </div>
                        <span className="text-xs bg-purple-500/20 text-purple-600 px-2 py-1 rounded-full">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3">
                    <span className="text-yellow-600">⏳</span>
                    <span className="text-yellow-700 font-medium">
                      Your profile is currently under review. You&apos;ll receive access to your full dashboard once approved.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Footer */}
          <div className="mt-8 text-center text-sm text-foreground/60">
            <p>
              {currentStep === 2 
                ? "We'll notify you via email when your profile is approved and you can access your full dashboard."
                : "You can update your profile details later from your dashboard."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 