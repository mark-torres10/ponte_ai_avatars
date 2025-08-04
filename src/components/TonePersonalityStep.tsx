'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'

// Predefined tone categories
const TONE_CATEGORIES = [
  { id: 'professional', label: 'Professional', description: 'Formal, business-like, authoritative' },
  { id: 'friendly', label: 'Friendly', description: 'Warm, approachable, conversational' },
  { id: 'energetic', label: 'Energetic', description: 'Dynamic, enthusiastic, high-energy' },
  { id: 'calm', label: 'Calm', description: 'Relaxed, soothing, composed' },
  { id: 'humorous', label: 'Humorous', description: 'Funny, witty, entertaining' },
  { id: 'educational', label: 'Educational', description: 'Instructive, informative, teaching-focused' },
  { id: 'motivational', label: 'Motivational', description: 'Inspiring, encouraging, uplifting' },
  { id: 'casual', label: 'Casual', description: 'Relaxed, informal, laid-back' },
]

// Personality trait labels
const PERSONALITY_TRAITS = {
  extroversion: { label: 'Extroversion', low: 'Introverted', high: 'Extroverted' },
  formality: { label: 'Formality', low: 'Casual', high: 'Formal' },
  energy: { label: 'Energy Level', low: 'Calm', high: 'Energetic' },
  professionalism: { label: 'Professionalism', low: 'Relaxed', high: 'Professional' },
}

const TonePersonalityStep: React.FC = () => {
  const { register, setValue, watch } = useFormContext()
  const [selectedTones, setSelectedTones] = useState<string[]>([])
  const [showCustomTone, setShowCustomTone] = useState(false)

  // Watch current values
  const personalityTraits = watch('personality.personalityTraits')
  const customTone = watch('personality.customTone')

  // Handle tone category selection
  const handleToneToggle = (toneId: string) => {
    const newSelectedTones = selectedTones.includes(toneId)
      ? selectedTones.filter(id => id !== toneId)
      : [...selectedTones, toneId]
    
    setSelectedTones(newSelectedTones)
    setValue('personality.toneCategories', newSelectedTones)
  }

  // Handle personality trait change
  const handleTraitChange = (trait: string, value: number) => {
    setValue(`personality.personalityTraits.${trait}`, value)
  }

  // Handle custom tone input
  const handleCustomToneChange = (value: string) => {
    setValue('personality.customTone', value)
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Define Your Communication Style</h3>
        <p className="text-foreground/70">
          Help us understand your personality and communication preferences to create an authentic AI avatar.
        </p>
      </div>

      {/* Tone Categories Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-3">Tone Categories</h4>
          <p className="text-sm text-foreground/60 mb-4">
            Select the tone categories that best describe your communication style. You can choose multiple options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TONE_CATEGORIES.map((tone) => (
            <button
              key={tone.id}
              type="button"
              onClick={() => handleToneToggle(tone.id)}
              className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                selectedTones.includes(tone.id)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
            >
              <div className="font-medium mb-1">{tone.label}</div>
              <div className="text-sm text-foreground/60">{tone.description}</div>
            </button>
          ))}
        </div>

        {/* Custom Tone Input */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowCustomTone(!showCustomTone)}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-2"
          >
            {showCustomTone ? '−' : '+'} Add Custom Tone Description
          </button>
          
          {showCustomTone && (
            <div className="mt-3">
              <textarea
                {...register('personality.customTone')}
                placeholder="Describe your unique communication style or tone..."
                className="w-full px-4 py-3 rounded-md border border-white/20 bg-white/5 hover:border-white/40 focus:border-primary transition-colors duration-200 min-h-[100px] resize-none"
                value={customTone || ''}
                onChange={(e) => handleCustomToneChange(e.target.value)}
              />
              <p className="mt-1 text-xs text-foreground/60">
                Optional: Add any specific details about your communication style that aren't covered above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Personality Traits Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-3">Personality Traits</h4>
          <p className="text-sm text-foreground/60 mb-4">
            Adjust the sliders to fine-tune your personality profile. This helps create a more accurate AI representation.
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(PERSONALITY_TRAITS).map(([trait, config]) => (
            <div key={trait} className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{config.label}</label>
                <span className="text-sm text-foreground/60">
                  {personalityTraits?.[trait] || 50}
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={personalityTraits?.[trait] || 50}
                  onChange={(e) => handleTraitChange(trait, parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-ponte"
                />
                <div className="flex justify-between text-xs text-foreground/50 mt-1">
                  <span>{config.low}</span>
                  <span>{config.high}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">
            Selected Tones: {selectedTones.length}
          </span>
          <span className="text-primary font-medium">
            {selectedTones.length > 0 ? 'Great! You&apos;ve defined your tone.' : 'Please select at least one tone category.'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TonePersonalityStep 