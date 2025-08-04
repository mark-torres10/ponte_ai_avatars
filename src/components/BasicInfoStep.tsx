'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'

export default function BasicInfoStep() {
  const { 
    register, 
    formState: { errors }
  } = useFormContext()

  const hasNameError = errors.basicInfo && 'name' in errors.basicInfo
  const hasEmailError = errors.basicInfo && 'email' in errors.basicInfo

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Tell us about yourself</h3>
        <p className="text-foreground/70">
          We&apos;ll use this information to create your talent profile and contact you about opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="md:col-span-2">
          <label htmlFor="basicInfo.name" className="block text-sm font-medium mb-2">
            Full Name *
          </label>
          <input
            id="basicInfo.name"
            type="text"
            {...register('basicInfo.name')}
            className={`w-full px-4 py-3 rounded-md border transition-colors duration-200 ${
              hasNameError
                ? 'border-red-500 bg-red-500/10' 
                : 'border-white/20 bg-white/5 hover:border-white/40 focus:border-primary'
            }`}
            placeholder="Enter your full name"
          />
          {hasNameError && (
            <p className="mt-1 text-sm text-red-400">
              Please enter your full name
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="md:col-span-2">
          <label htmlFor="basicInfo.email" className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <input
            id="basicInfo.email"
            type="email"
            {...register('basicInfo.email')}
            className={`w-full px-4 py-3 rounded-md border transition-colors duration-200 ${
              hasEmailError
                ? 'border-red-500 bg-red-500/10' 
                : 'border-white/20 bg-white/5 hover:border-white/40 focus:border-primary'
            }`}
            placeholder="Enter your email address"
          />
          {hasEmailError && (
            <p className="mt-1 text-sm text-red-400">
              Please enter a valid email address
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="basicInfo.phone" className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <input
            id="basicInfo.phone"
            type="tel"
            {...register('basicInfo.phone')}
            className="w-full px-4 py-3 rounded-md border border-white/20 bg-white/5 hover:border-white/40 focus:border-primary transition-colors duration-200"
            placeholder="Enter your phone number"
          />
          <p className="mt-1 text-xs text-foreground/60">
            Optional - for urgent opportunities
          </p>
        </div>

        {/* Location Field */}
        <div>
          <label htmlFor="basicInfo.location" className="block text-sm font-medium mb-2">
            Location
          </label>
          <input
            id="basicInfo.location"
            type="text"
            {...register('basicInfo.location')}
            className="w-full px-4 py-3 rounded-md border border-white/20 bg-white/5 hover:border-white/40 focus:border-primary transition-colors duration-200"
            placeholder="City, Country"
          />
          <p className="mt-1 text-xs text-foreground/60">
            Optional - helps with timezone coordination
          </p>
        </div>
      </div>

      {/* Information Notice */}
      <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">ℹ</span>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1">How we use your information</h4>
            <p className="text-xs text-foreground/70">
              Your contact information will only be used to notify you about avatar licensing opportunities 
              and important platform updates. We never share your personal information with third parties 
              without your explicit consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 