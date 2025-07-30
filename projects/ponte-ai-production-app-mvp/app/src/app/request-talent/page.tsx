"use client"

import { useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { cn } from "@/lib/utils"

// Sample avatar data for the carousel
const avatars = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Tech Influencer",
    rating: "4.9",
    bookings: "1,250",
    price: "$2,500 - $15,000",
    tags: ["Product Launches", "Training Videos"],
    description: "Leading tech influencer with expertise in AI, blockchain, and emerging technologies.",
    specialties: ["Tech Reviews", "Product Demos", "Educational Content"]
  },
  {
    id: 2,
    name: "Sarah Martinez",
    role: "Celebrity Chef",
    rating: "4.8",
    bookings: "890",
    price: "$3,000 - $20,000",
    tags: ["Food Campaigns", "Cooking Tutorials"],
    description: "Award-winning chef known for innovative fusion cuisine and engaging cooking content.",
    specialties: ["Recipe Videos", "Food Branding", "Culinary Education"]
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Professional Athlete",
    rating: "5.0",
    bookings: "2,100",
    price: "$5,000 - $35,000",
    tags: ["Sports Marketing", "Motivational Content"],
    description: "Olympic medalist and motivational speaker with global brand appeal.",
    specialties: ["Sports Endorsements", "Motivational Speaking", "Fitness Content"]
  },
  {
    id: 4,
    name: "Emma Chen",
    role: "Podcast Host",
    rating: "4.7",
    bookings: "675",
    price: "$1,800 - $12,000",
    tags: ["Interview Style", "Educational Content"],
    description: "Popular podcast host with engaging interview style and educational expertise.",
    specialties: ["Interviews", "Educational Content", "Brand Storytelling"]
  },
  {
    id: 5,
    name: "David Rodriguez",
    role: "Fitness Expert",
    rating: "4.9",
    bookings: "1,450",
    price: "$2,200 - $18,000",
    tags: ["Fitness Content", "Wellness Campaigns"],
    description: "Certified fitness trainer and wellness advocate with proven results.",
    specialties: ["Workout Videos", "Wellness Tips", "Fitness Branding"]
  }
]

export default function RequestTalentPage() {
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0)
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const nextAvatar = () => {
    setCurrentAvatarIndex((prev) => (prev + 1) % avatars.length)
  }

  const prevAvatar = () => {
    setCurrentAvatarIndex((prev) => (prev - 1 + avatars.length) % avatars.length)
  }

  const handleAvatarSelect = (avatarId: number) => {
    setSelectedAvatar(avatarId)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    // In a real app, this would send data to the backend
    console.log("Form submitted:", { selectedAvatar, formData })
  }

  const currentAvatar = avatars[currentAvatarIndex]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  Request Submitted Successfully!
                </h1>
                <p className="text-lg text-foreground/70 mb-8">
                  Thank you for your interest in our AI avatar services. Our team will review your request and get back to you within 24 hours.
                </p>
              </div>

              <div className="card-ponte p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-4">Request Summary</h3>
                <div className="space-y-2 text-left">
                  <p><strong>Selected Avatar:</strong> {selectedAvatar ? avatars.find(a => a.id === selectedAvatar)?.name : "None selected"}</p>
                  <p><strong>Contact:</strong> {formData.name} ({formData.email})</p>
                  <p><strong>Company:</strong> {formData.company}</p>
                  <p><strong>Project Type:</strong> {formData.projectType}</p>
                  <p><strong>Budget Range:</strong> {formData.budget}</p>
                  <p><strong>Timeline:</strong> {formData.timeline}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setSelectedAvatar(null)
                    setFormData({
                      name: "",
                      email: "",
                      company: "",
                      projectType: "",
                      budget: "",
                      timeline: "",
                      description: ""
                    })
                  }}
                  className="btn-primary-ponte text-base px-6 py-3 rounded-md font-medium"
                >
                  Submit Another Request
                </button>
                <Link
                  href="/"
                  className="btn-secondary-ponte text-base px-6 py-3 rounded-md font-medium"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Request AI Avatar{" "}
              <span className="text-gradient">Talent</span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Browse our premium AI avatars and submit your project requirements. 
              Our team will match you with the perfect avatar for your campaign.
            </p>
          </div>

          {/* Avatar Carousel */}
          <div className="mb-12">
            <div className="relative max-w-4xl mx-auto">
              {/* Carousel Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={prevAvatar}
                  className="btn-secondary-ponte p-3 rounded-full"
                  aria-label="Previous avatar"
                >
                  ←
                </button>
                <div className="text-center">
                  <span className="text-sm text-foreground/60">
                    {currentAvatarIndex + 1} of {avatars.length}
                  </span>
                </div>
                <button
                  onClick={nextAvatar}
                  className="btn-secondary-ponte p-3 rounded-full"
                  aria-label="Next avatar"
                >
                  →
                </button>
              </div>

              {/* Avatar Display */}
              <div className="card-ponte p-8 rounded-lg">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Avatar Image */}
                  <div className="relative">
                    <div className="w-full h-64 bg-gradient-to-br from-ponte-pink-400 to-ponte-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-xl">{currentAvatar.name}</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-primary-foreground text-sm px-3 py-1 rounded">
                      ⭐ {currentAvatar.rating}
                    </div>
                  </div>

                  {/* Avatar Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{currentAvatar.name}</h3>
                      <p className="text-lg text-primary">{currentAvatar.role}</p>
                    </div>

                    <p className="text-foreground/70">{currentAvatar.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <span>📊 {currentAvatar.bookings} bookings</span>
                      <span className="font-semibold text-primary">{currentAvatar.price}</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentAvatar.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="text-xs px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAvatarSelect(currentAvatar.id)}
                      className={cn(
                        "w-full py-3 rounded-md font-medium transition-all duration-200",
                        selectedAvatar === currentAvatar.id
                          ? "btn-primary-ponte"
                          : "btn-secondary-ponte"
                      )}
                    >
                      {selectedAvatar === currentAvatar.id ? "✓ Selected" : "Select This Avatar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request Form */}
          <div className="max-w-2xl mx-auto">
            <div className="card-ponte p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Project Requirements</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary"
                      placeholder="your.email@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary"
                    placeholder="Your company name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                      className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Select project type</option>
                      <option value="Marketing Campaign">Marketing Campaign</option>
                      <option value="Product Launch">Product Launch</option>
                      <option value="Training Video">Training Video</option>
                      <option value="Social Media Content">Social Media Content</option>
                      <option value="Educational Content">Educational Content</option>
                      <option value="Brand Endorsement">Brand Endorsement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

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
                      className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Select budget range</option>
                      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                      <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                      <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                      <option value="$50,000+">$50,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium mb-2">
                    Timeline *
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="">Select timeline</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="3+ months">3+ months</option>
                  </select>
                </div>

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
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary resize-none"
                    placeholder="Describe your project requirements, goals, and any specific needs..."
                  />
                </div>

                {selectedAvatar && (
                  <div className="p-4 bg-primary/20 border border-primary/30 rounded-md">
                    <p className="text-sm">
                      <strong>Selected Avatar:</strong> {avatars.find(a => a.id === selectedAvatar)?.name}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary-ponte text-base py-4 rounded-md font-medium"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 