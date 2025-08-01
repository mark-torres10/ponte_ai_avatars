'use client';

import { useState } from 'react';

interface FormData {
  [key: string]: unknown;
}

interface StoryCreationStepProps {
  onDataUpdate?: (data: FormData) => void;
  formData?: FormData;
}

export default function StoryCreationStep({ onDataUpdate, formData }: StoryCreationStepProps) {
  const [storyData, setStoryData] = useState({
    brandMission: (formData?.brandMission as string) || '',
    storyToTell: (formData?.storyToTell as string) || '',
    emotionalTone: (formData?.emotionalTone as string) || '',
    callToAction: (formData?.callToAction as string) || ''
  });

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...storyData, [field]: value };
    setStoryData(updatedData);
    
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Your Story, <span className="text-gradient">Their Voice</span>
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Let&apos;s craft the perfect message that captures your brand&apos;s essence and connects with your audience.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div>
          <label htmlFor="brandMission" className="block text-sm font-medium mb-2">
            Your Brand&apos;s Mission
          </label>
          <textarea
            id="brandMission"
            value={storyData.brandMission}
            onChange={(e) => handleInputChange('brandMission', e.target.value)}
            placeholder="What is your brand's core mission and purpose?"
            rows={3}
            className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div>
          <label htmlFor="storyToTell" className="block text-sm font-medium mb-2">
            The Story You Want to Tell
          </label>
          <textarea
            id="storyToTell"
            value={storyData.storyToTell}
            onChange={(e) => handleInputChange('storyToTell', e.target.value)}
            placeholder="What story do you want your avatar to tell about your brand?"
            rows={4}
            className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div>
          <label htmlFor="emotionalTone" className="block text-sm font-medium mb-2">
            How You Want to Make People Feel
          </label>
          <select
            id="emotionalTone"
            value={storyData.emotionalTone}
            onChange={(e) => handleInputChange('emotionalTone', e.target.value)}
            className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">Select the emotional tone...</option>
            <option value="motivated">Motivated and Inspired</option>
            <option value="confident">Confident and Empowered</option>
            <option value="excited">Excited and Energized</option>
            <option value="trusted">Trusted and Secure</option>
            <option value="entertained">Entertained and Engaged</option>
          </select>
        </div>

        <div>
          <label htmlFor="callToAction" className="block text-sm font-medium mb-2">
            The Action You Want Them to Take
          </label>
          <input
            type="text"
            id="callToAction"
            value={storyData.callToAction}
            onChange={(e) => handleInputChange('callToAction', e.target.value)}
            placeholder="What should your audience do after watching?"
            className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Premium Feature Tease */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
        <div className="flex items-center justify-center mb-3">
          <span className="bg-gradient-ponte text-white text-xs px-3 py-1 rounded-full font-medium">
            Premium Feature
          </span>
        </div>
        <h4 className="font-semibold mb-2 text-center">Advanced Script Customization</h4>
        <p className="text-sm text-foreground/70 text-center">
          Get AI-powered script optimization, A/B testing variations, and industry-specific templates with our premium service.
        </p>
      </div>
    </div>
  );
}