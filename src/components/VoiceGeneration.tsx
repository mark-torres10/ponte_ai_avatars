'use client';

import { useState, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { Persona } from '@/lib/personas';

interface VoiceGenerationProps {
  selectedPersona: Persona | null;
  currentText: string;
  onVoiceGenerated: (audioUrl: string) => void;
  originalText?: string;
  personalizedText?: string;
  isUsingPersonalized?: boolean;
  onScriptChange?: (text: string, isPersonalized: boolean) => void;
}

export default function VoiceGeneration({ 
  selectedPersona, 
  currentText, 
  onVoiceGenerated,
  originalText,
  personalizedText,
  isUsingPersonalized = false,
  onScriptChange
}: VoiceGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerateVoice = async () => {
    if (!selectedPersona) {
      setError('Please select a persona first');
      return;
    }

    if (!currentText.trim()) {
      setError('Please enter some text to generate voice');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setHasPlayedAudio(false);

    try {
      const response = await apiClient.generateVoice(currentText, selectedPersona.id);
      
      if (response.success && response.data) {
        setAudioUrl(response.data.audioUrl);
        onVoiceGenerated(response.data.audioUrl);
      } else {
        setError(response.error as string || 'Failed to generate voice');
      }
    } catch (err) {
      console.error('Voice generation error:', err);
      setError('Failed to connect to voice generation service. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setHasPlayedAudio(true);
  };

  const handleAudioError = () => {
    setError('Failed to play audio. Please try generating voice again.');
    setIsPlaying(false);
  };

  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    
    try {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `voice-${selectedPersona?.id}-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download audio. Please try again.');
    }
  };

  const hasText = currentText.trim().length > 0;
  const hasAudio = audioUrl !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Generate <span className="text-gradient">Voice</span>
        </h2>
        <p className="text-foreground/70 mb-6">
          Convert your text into natural-sounding speech with your selected avatar&apos;s voice
        </p>
      </div>

      {/* Voice Generation Controls */}
      <div className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Script Selection */}
        {originalText && personalizedText && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-muted/50">
            <h3 className="font-medium text-center mb-3">Choose Script for Voice Generation:</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onScriptChange?.(originalText, false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isUsingPersonalized 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                Use Original Script
              </button>
              <button
                onClick={() => onScriptChange?.(personalizedText, true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isUsingPersonalized 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                Use AI Personalized Script
              </button>
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground/60">
                Currently using: <span className="font-medium">{isUsingPersonalized ? 'AI Personalized' : 'Original'} Script</span>
              </p>
            </div>
          </div>
        )}

        {/* Generate Voice Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGenerateVoice}
            disabled={!selectedPersona || !hasText || isGenerating}
            className="btn-primary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Voice...
              </div>
            ) : (
              'Generate Voice'
            )}
          </button>

          {/* Audio Player */}
          {hasAudio && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePlayPause}
                disabled={isGenerating}
                className="btn-secondary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  {isPlaying ? (
                    <>
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                      </div>
                      Pause Audio
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-current border-t-2 border-t-transparent border-b-2 border-b-transparent ml-0.5"></div>
                      </div>
                      Play Audio
                    </>
                  )}
                </div>
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownloadAudio}
                disabled={isGenerating}
                className="btn-secondary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Download Audio
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Audio Element */}
        {hasAudio && (
          <div className="space-y-3">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={handleAudioEnded}
              onError={handleAudioError}
              className="w-full"
              controls
              preload="metadata"
            />
            
            {/* Audio Status */}
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">
                Voice generated successfully
              </span>
            </div>
          </div>
        )}

        {/* Feedback Section - Only show after audio has been played */}
        {hasAudio && hasPlayedAudio && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-muted/50">
            <h3 className="font-medium text-center mb-3">How was the voice?</h3>
            
            {/* Tone Adjustment */}
            <div className="space-y-2">
              <p className="text-sm text-foreground/70 text-center">Adjust the tone:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button className="px-3 py-2 text-xs bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-md transition-colors">
                  More Professional
                </button>
                <button className="px-3 py-2 text-xs bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-md transition-colors">
                  More Casual
                </button>
                <button className="px-3 py-2 text-xs bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-md transition-colors">
                  More Friendly
                </button>
                <button className="px-3 py-2 text-xs bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-md transition-colors">
                  More Formal
                </button>
              </div>
            </div>

            {/* Excitement Level */}
            <div className="space-y-2">
              <p className="text-sm text-foreground/70 text-center">Adjust excitement:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button className="px-3 py-2 text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-md transition-colors">
                  More Excited
                </button>
                <button className="px-3 py-2 text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-md transition-colors">
                  Less Excited
                </button>
                <button className="px-3 py-2 text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-md transition-colors">
                  More Calm
                </button>
                <button className="px-3 py-2 text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-md transition-colors">
                  More Energetic
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        {!selectedPersona && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-600 text-sm">
              ⚠️ Please select a persona above to enable voice generation
            </p>
          </div>
        )}

        {!hasText && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-600 text-sm">
              💡 Enter text above to generate voice
            </p>
          </div>
        )}

        {/* Voice Generation Info */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">Voice Generation Features:</h3>
          <ul className="text-sm text-foreground/70 space-y-1">
            <li>• Uses ElevenLabs AI voice synthesis</li>
            <li>• Custom voice models for each persona</li>
            <li>• High-quality, natural-sounding speech</li>
            <li>• Supports up to 5000 characters per generation</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 