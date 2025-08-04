'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'

export default function ReviewStep() {
  const { watch } = useFormContext()
  const formData = watch()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Review Your Application</h3>
        <p className="text-foreground/70">
          Please review your information before submitting your application.
        </p>
      </div>

      {/* Basic Information Review */}
      <div className="card-ponte p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-4 text-primary">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground/60">Full Name</label>
            <p className="text-foreground">{formData.basicInfo?.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground/60">Email Address</label>
            <p className="text-foreground">{formData.basicInfo?.email || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground/60">Phone Number</label>
            <p className="text-foreground">{formData.basicInfo?.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground/60">Location</label>
            <p className="text-foreground">{formData.basicInfo?.location || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Media Upload Review */}
      <div className="card-ponte p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-4 text-primary">Media Upload</h4>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground/60">Headshots</label>
            <div className="mt-2">
              {formData.media?.headshots && formData.media.headshots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.media.headshots.map((file: File, index: number) => (
                    <div key={index} className="text-sm text-foreground/80 bg-white/10 px-3 py-1 rounded">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/60">No headshots uploaded</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground/60">Video Sample</label>
            <div className="mt-2">
              {formData.media?.videoSample ? (
                <div className="text-sm text-foreground/80 bg-white/10 px-3 py-1 rounded inline-block">
                  {formData.media.videoSample.name} ({(formData.media.videoSample.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              ) : (
                <p className="text-foreground/60">No video sample uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tone & Personality Review */}
      <div className="card-ponte p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-4 text-primary">Tone & Personality</h4>
        <p className="text-foreground/70">
          Personality and tone selection will be available in the next step of development.
        </p>
      </div>

      {/* Self Interview Review */}
      <div className="card-ponte p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-4 text-primary">Self Interview</h4>
        <p className="text-foreground/70">
          Self interview questions will be available in the next step of development.
        </p>
      </div>

      {/* Submission Notice */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">ℹ</span>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1">Ready to Submit</h4>
            <p className="text-xs text-foreground/70">
              By clicking &quot;Submit Application&quot;, you agree to our terms of service and privacy policy. 
              Our team will review your application and contact you within 2-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 