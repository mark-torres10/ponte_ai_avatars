'use client';

import { useState, useEffect } from 'react';
import { WizardFormData, WizardStepProps } from '@/types/wizard';

interface ValidationErrors {
  brandMission?: string;
  storyToTell?: string;
  emotionalTone?: string;
  callToAction?: string;
}

export default function StoryCreationStep({ onDataUpdate, formData }: WizardStepProps) {
  const [storyData, setStoryData] = useState({
    brandMission: typeof formData?.brandMission === 'string' ? formData.brandMission : '',
    storyToTell: typeof formData?.storyToTell === 'string' ? formData.storyToTell : '',
    emotionalTone: typeof formData?.emotionalTone === 'string' ? formData.emotionalTone : '',
    callToAction: typeof formData?.callToAction === 'string' ? formData.callToAction : ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation function
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'brandMission':
        if (!value.trim()) return 'Brand mission is required';
        if (value.trim().length < 10) return 'Brand mission must be at least 10 characters';
        if (value.trim().length > 500) return 'Brand mission must be less than 500 characters';
        break;
      case 'storyToTell':
        if (!value.trim()) return 'Story is required';
        if (value.trim().length < 20) return 'Story must be at least 20 characters';
        if (value.trim().length > 1000) return 'Story must be less than 1000 characters';
        break;
      case 'emotionalTone':
        if (!value) return 'Please select an emotional tone';
        break;
      case 'callToAction':
        if (!value.trim()) return 'Call to action is required';
        if (value.trim().length < 5) return 'Call to action must be at least 5 characters';
        if (value.trim().length > 200) return 'Call to action must be less than 200 characters';
        break;
    }
    return undefined;
  };

  // Validate all fields and update form validity
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(storyData).forEach(field => {
      const error = validateField(field, storyData[field as keyof typeof storyData]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...storyData, [field]: value };
    setStoryData(updatedData);
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, storyData[field as keyof typeof storyData]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Validate on mount if form data exists and when storyData changes
  useEffect(() => {
    if (Object.values(storyData).some(value => value)) {
      validateForm();
    }
  }, [storyData]);

  const getFieldClassName = (field: string) => {
    const hasError = errors[field as keyof ValidationErrors];
    const isTouched = touched[field];
    
    return `w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary resize-none ${
      hasError && isTouched 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-white/20 focus:border-primary'
    }`;
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
            Your Brand&apos;s Mission <span className="text-red-500">*</span>
          </label>
          <textarea
            id="brandMission"
            value={storyData.brandMission}
            onChange={(e) => handleInputChange('brandMission', e.target.value)}
            onBlur={() => handleBlur('brandMission')}
            placeholder="What is your brand's core mission and purpose?"
            rows={3}
            className={getFieldClassName('brandMission')}
          />
          {errors.brandMission && touched.brandMission && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.brandMission}
            </p>
          )}
          <p className="text-xs text-foreground/50 mt-1">
            {storyData.brandMission.length}/500 characters
          </p>
        </div>

        <div>
          <label htmlFor="storyToTell" className="block text-sm font-medium mb-2">
            The Story You Want to Tell <span className="text-red-500">*</span>
          </label>
          <textarea
            id="storyToTell"
            value={storyData.storyToTell}
            onChange={(e) => handleInputChange('storyToTell', e.target.value)}
            onBlur={() => handleBlur('storyToTell')}
            placeholder="What story do you want your avatar to tell about your brand?"
            rows={4}
            className={getFieldClassName('storyToTell')}
          />
          {errors.storyToTell && touched.storyToTell && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.storyToTell}
            </p>
          )}
          <p className="text-xs text-foreground/50 mt-1">
            {storyData.storyToTell.length}/1000 characters
          </p>
        </div>

        <div>
          <label htmlFor="emotionalTone" className="block text-sm font-medium mb-2">
            How You Want to Make People Feel <span className="text-red-500">*</span>
          </label>
          <select
            id="emotionalTone"
            value={storyData.emotionalTone}
            onChange={(e) => handleInputChange('emotionalTone', e.target.value)}
            onBlur={() => handleBlur('emotionalTone')}
            className={getFieldClassName('emotionalTone')}
          >
            <option value="">Select the emotional tone...</option>
            <option value="motivated">Motivated and Inspired</option>
            <option value="confident">Confident and Empowered</option>
            <option value="excited">Excited and Energized</option>
            <option value="trusted">Trusted and Secure</option>
            <option value="entertained">Entertained and Engaged</option>
          </select>
          {errors.emotionalTone && touched.emotionalTone && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.emotionalTone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="callToAction" className="block text-sm font-medium mb-2">
            The Action You Want Them to Take <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="callToAction"
            value={storyData.callToAction}
            onChange={(e) => handleInputChange('callToAction', e.target.value)}
            onBlur={() => handleBlur('callToAction')}
            placeholder="What should your audience do after watching?"
            className={getFieldClassName('callToAction')}
          />
          {errors.callToAction && touched.callToAction && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.callToAction}
            </p>
          )}
          <p className="text-xs text-foreground/50 mt-1">
            {storyData.callToAction.length}/200 characters
          </p>
        </div>
      </div>

      {/* Form Status */}
      <div className="p-4 bg-background/50 border border-white/10 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isFormValid ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm text-foreground/70">
              {isFormValid ? 'Form is complete' : 'Please fill in all required fields'}
            </span>
          </div>
          <div className="text-xs text-foreground/50">
            {Object.values(storyData).filter(v => v.trim()).length}/4 fields completed
          </div>
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