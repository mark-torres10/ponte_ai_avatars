'use client';

import { useState, useRef, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Persona } from '@/lib/personas';

interface VideoGenerationProps {
  selectedPersona: Persona | null;
  currentAudioUrl: string | null;
  onVideoGenerated?: (videoUrl: string) => void;
}

export default function VideoGeneration({ 
  selectedPersona, 
  currentAudioUrl,
  onVideoGenerated
}: VideoGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [videoFormat, setVideoFormat] = useState<'mp4' | 'webm'>('mp4');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const videoRef = useRef<HTMLVideoElement>(null);





  const handleGenerateVideo = async () => {
    if (!selectedPersona) {
      setError('Please select a persona first');
      return;
    }

    if (!currentAudioUrl) {
      setError('Please generate voice first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setStatus('processing');
    setProgress(0);
    setVideoUrl(null);

    try {
      const response = await apiClient.generateVideo(
        currentAudioUrl,
        selectedPersona.id,
        selectedImageIndex,
        videoFormat,
        quality
      );
      
      if (response.success && response.data) {
        if (response.data.status === 'completed' && response.data.videoUrl) {
          setVideoUrl(response.data.videoUrl);
          setStatus('completed');
          setProgress(100);
          setIsGenerating(false);
          onVideoGenerated?.(response.data.videoUrl);
        } else {
          setError('Video generation failed - unexpected response');
          setStatus('failed');
          setIsGenerating(false);
        }
      } else {
        setError(response.error as string || 'Failed to generate video');
        setStatus('failed');
        setIsGenerating(false);
      }
    } catch (err) {
      console.error('Video generation error:', err);
      if (err instanceof Error) {
        setError(`Video generation failed: ${err.message}`);
      } else {
        setError('Failed to connect to video generation service. Please try again.');
      }
      setStatus('failed');
      setIsGenerating(false);
    }
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    
    try {
      const link = document.createElement('a');
      link.href = videoUrl;
      const personaId = selectedPersona?.id || 'unknown';
      link.download = `video-${personaId}-${Date.now()}.${videoFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download video. Please try again.');
    }
  };



  const hasAudio = currentAudioUrl !== null;
  const hasVideo = videoUrl !== null;
  const canGenerate = selectedPersona && hasAudio && !isGenerating;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Generate <span className="text-gradient">Video</span>
        </h2>
        <p className="text-foreground/70 mb-6">
          Create an AI-powered video with your selected avatar speaking your generated voice
        </p>
      </div>

      {/* Video Generation Controls */}
      <div className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Image Selection */}
        {selectedPersona && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-muted/50">
            <h3 className="font-medium text-center mb-3">Choose Avatar Image:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {selectedPersona.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-muted hover:border-muted/80'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${selectedPersona.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedImageIndex === index && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground/60">
                Selected: Image {selectedImageIndex + 1} of {selectedPersona.images.length}
              </p>
            </div>
          </div>
        )}

        {/* Video Settings */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-muted/50">
          <h3 className="font-medium text-center mb-3">Video Settings:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format:</label>
              <select
                value={videoFormat}
                onChange={(e) => setVideoFormat(e.target.value as 'mp4' | 'webm')}
                className="w-full px-3 py-2 bg-background border border-muted rounded-md text-sm"
              >
                <option value="mp4">MP4 (Recommended)</option>
                <option value="webm">WebM</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quality:</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 bg-background border border-muted rounded-md text-sm"
              >
                <option value="low">Low (Faster)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Best Quality)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Generate Video Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGenerateVideo}
            disabled={!canGenerate}
            className="btn-primary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Video...
              </div>
            ) : (
              'Generate Video'
            )}
          </button>

          {/* Video Controls */}
          {hasVideo && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadVideo}
                disabled={isGenerating}
                className="btn-secondary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Download Video
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-muted/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Generating Video...</span>
              <span className="text-sm text-foreground/60">Processing</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-foreground/60 text-center">
              This may take up to 2 minutes...
            </p>
          </div>
        )}

        {/* Video Player */}
        {hasVideo && (
          <div className="space-y-3">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full rounded-lg"
              controls
              preload="metadata"
            />
            
            {/* Video Status */}
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">
                Video generated successfully
              </span>
            </div>
          </div>
        )}

        {/* Requirements */}
        {!selectedPersona && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-600 text-sm">
              ⚠️ Please select a persona above to enable video generation
            </p>
          </div>
        )}

        {!hasAudio && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-600 text-sm">
              💡 Generate voice above to create video
            </p>
          </div>
        )}

        {/* Video Generation Info */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">Video Generation Features:</h3>
          <ul className="text-sm text-foreground/70 space-y-1">
            <li>• Uses D-ID AI video synthesis</li>
            <li>• Syncs avatar mouth movements with audio</li>
            <li>• High-quality, natural-looking videos</li>
            <li>• Multiple image options for each persona</li>
            <li>• Configurable quality and format settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 