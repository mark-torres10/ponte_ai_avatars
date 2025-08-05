'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Persona } from '@/lib/personas';

interface TextInputProps {
  selectedPersona: Persona | null;
  onTextChange: (text: string, isPersonalized?: boolean, original?: string, personalized?: string) => void;
  onManualSave?: () => void;
}

export default function TextInput({ selectedPersona, onTextChange, onManualSave }: TextInputProps) {
  const [originalText, setOriginalText] = useState('Hey there! I want to tell you about this amazing new product that will revolutionize your daily routine. It\'s packed with incredible features that will make your life so much easier.');
  const [personalizedText, setPersonalizedText] = useState('');
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [showPersonalized, setShowPersonalized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize with placeholder text
  useEffect(() => {
    onTextChange(originalText, false, originalText, '');
  }, [onTextChange, originalText]);

  // Handle Ctrl+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        if (onManualSave && hasUnsavedChanges) {
          onManualSave()
          setHasUnsavedChanges(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onManualSave, hasUnsavedChanges])

  const handleTextChange = (text: string) => {
    setOriginalText(text);
    setError(null);
    setHasUnsavedChanges(true);
    onTextChange(text, showPersonalized, text, personalizedText);
  };

  const handleBlur = () => {
    if (hasUnsavedChanges && onManualSave) {
      onManualSave()
      setHasUnsavedChanges(false)
    }
  };

  const handlePersonalize = async () => {
    if (!selectedPersona) {
      setError('Please select a persona first');
      return;
    }

    if (!originalText.trim()) {
      setError('Please enter some text to personalize');
      return;
    }

    setIsPersonalizing(true);
    setError(null);

    try {
      const response = await apiClient.personalizeText(originalText, selectedPersona.id);
      
      if (response.success && response.data) {
        setPersonalizedText(response.data.personalizedText);
        setShowPersonalized(true);
        // Update parent with personalized text
        onTextChange(response.data.personalizedText, true, originalText, response.data.personalizedText);
      } else {
        setError(response.error as string || 'Failed to personalize text');
      }
    } catch (err) {
      console.error('Personalization error:', err);
      setError('Failed to connect to personalization service. Please try again.');
    } finally {
      setIsPersonalizing(false);
    }
  };

  const handleToggle = () => {
    const newShowPersonalized = !showPersonalized;
    setShowPersonalized(newShowPersonalized);
    // Update the parent component with the correct text
    onTextChange(newShowPersonalized ? personalizedText : originalText, newShowPersonalized, originalText, personalizedText);
  };

  const currentText = showPersonalized ? personalizedText : originalText;
  const hasPersonalizedText = personalizedText.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Enter Your <span className="text-gradient">Script</span>
        </h2>
        <p className="text-foreground/70 mb-6">
          Write your message and let AI personalize it for your selected avatar
        </p>
      </div>

      {/* Text Input */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={currentText}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Enter your script here... (max 1000 characters)"
            className="w-full h-32 p-4 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            maxLength={1000}
            disabled={isPersonalizing}
          />
          <div className="absolute bottom-2 right-2 text-xs text-foreground/50">
            {currentText.length}/1000
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePersonalize}
            disabled={!selectedPersona || !originalText.trim() || isPersonalizing}
            className="btn-primary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            {isPersonalizing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Personalizing with AI...
              </div>
            ) : (
              'Personalize with AI'
            )}
          </button>

          {hasPersonalizedText && (
            <button
              onClick={handleToggle}
              className="btn-secondary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              {showPersonalized ? 'Show Original' : 'Show AI Version'}
            </button>
          )}
        </div>

        {/* Version Indicator */}
        {hasPersonalizedText && (
          <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${showPersonalized ? 'bg-primary' : 'bg-foreground/30'}`}></div>
            <span className="text-sm font-medium">
              {showPersonalized ? 'AI Personalized Version' : 'Original Version'}
            </span>
            <div className={`w-3 h-3 rounded-full ${!showPersonalized ? 'bg-primary' : 'bg-foreground/30'}`}></div>
          </div>
        )}

        {/* Persona Requirement */}
        {!selectedPersona && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-600 text-sm">
              ⚠️ Please select a persona above to enable AI personalization
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 