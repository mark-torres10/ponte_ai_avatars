'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { Persona } from '@/lib/personas';
import StorageErrorDisplay from './StorageErrorDisplay';

interface VideoGenerationProps {
  selectedPersona: Persona | null;
  audioUrl: string | null;
  currentText: string;
  onVideoGenerated: (videoUrl: string) => void;
}

export default function VideoGeneration({ 
  selectedPersona, 
  audioUrl, 
  currentText,
  onVideoGenerated
}: VideoGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useCachedAvatar, setUseCachedAvatar] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get available images for the selected persona
  const availableImages = selectedPersona?.images || [];
  const selectedImage = availableImages[selectedImageIndex];

  const handleGenerateVideo = async () => {
    if (!selectedPersona) {
      setError('Please select a persona first');
      return;
    }

    if (!audioUrl) {
      setError('Please generate voice first');
      return;
    }

    if (!currentText.trim()) {
      setError('Please enter some text to generate video');
      return;
    }

    if (!selectedImage) {
      setError('Please select an avatar image');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setStorageError(null);
    setGenerationProgress('Initializing video generation...');

    try {
      // Get the image URL (handle both string and AvatarImage object)
      const imageUrl = typeof selectedImage === 'string' ? selectedImage : selectedImage.url;
      
      // Only log in development environment
      if (process.env.NODE_ENV === 'development') {
        console.log('Sending video generation request:', {
          text: currentText,
          personaId: selectedPersona.id,
          audioUrl: audioUrl ? '[REDACTED]' : null,
          avatarImageUrl: imageUrl ? '[REDACTED]' : null,
          useCachedAvatar: useCachedAvatar
        });
      }
      
      const response = await apiClient.generateVideo({
        text: currentText,
        personaId: selectedPersona.id,
        audioUrl: audioUrl,
        avatarImageUrl: imageUrl,
        useCachedAvatar: useCachedAvatar
      });
      
      if (response.success && response.data) {
        setVideoUrl(response.data.videoUrl);
        onVideoGenerated(response.data.videoUrl);
        setGenerationProgress('Video generated successfully!');
        
        // Check for storage errors in the response
        if (response.data.storageInfo === undefined) {
          setStorageError('Video was generated but could not be saved to storage. You can still play and download the video.');
        }
      } else {
        setError(response.error as string || 'Failed to generate video');
        setGenerationProgress('');
      }
    } catch (err) {
      console.error('Video generation error:', err);
      if (err instanceof Error) {
        setError(`Video generation failed: ${err.message}`);
      } else {
        setError('Failed to connect to video generation service. Please try again.');
      }
      setGenerationProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleVideoError = () => {
    setError('Failed to play video. Please try generating video again.');
    setIsPlaying(false);
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    
    try {
      const link = document.createElement('a');
      link.href = videoUrl;
      const personaId = selectedPersona?.id || 'unknown';
      link.download = `avatar-${personaId}-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download video. Please try again.');
    }
  };

  const hasAudio = audioUrl !== null;
  const hasVideo = videoUrl !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Generate <span className="text-gradient">AI Avatar</span>
        </h2>
        <p className="text-foreground/70 mb-6">
          Create a talking avatar video using your generated voice and selected persona
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

        {/* Storage Error Display */}
        <StorageErrorDisplay
          error={storageError}
          onDismiss={() => setStorageError(null)}
          showRetry={false}
        />

        {/* Avatar Image Selection */}
        {selectedPersona && availableImages.length > 0 && (
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h3 className="font-medium mb-3">Select Avatar Image:</h3>
            <div className="grid grid-cols-5 gap-3">
              {availableImages.map((image, index) => {
                const imageUrl = typeof image === 'string' ? image : image.url;
                const imageAlt = typeof image === 'string' 
                  ? `${selectedPersona.name} - Image ${index + 1}` 
                  : image.alt;
                
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 relative ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-primary shadow-lg scale-105' 
                        : 'hover:scale-105 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 20vw, 15vw"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-foreground/70 mt-2">
              Choose which avatar image to use for video generation
            </p>
          </div>
        )}

        {/* Caching Toggle for Local Testing */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-700 mb-1">Local Testing Mode</h3>
              <p className="text-sm text-blue-600">
                Use cached avatar recordings for quick testing without D-ID API calls
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useCachedAvatar}
                onChange={(e) => setUseCachedAvatar(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {useCachedAvatar && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
              ⚡ Using cached recordings - no API calls will be made
            </div>
          )}
        </div>

        {/* Generate Video Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGenerateVideo}
            disabled={!selectedPersona || !hasAudio || isGenerating}
            className="btn-primary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Avatar...
              </div>
            ) : (
              'Generate AI Avatar'
            )}
          </button>

          {/* Video Controls */}
          {hasVideo && (
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
                      Pause Video
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-current border-t-2 border-t-transparent border-b-2 border-b-transparent ml-0.5"></div>
                      </div>
                      Play Video
                    </>
                  )}
                </div>
              </button>

              {/* Download Button */}
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

        {/* Generation Progress */}
        {isGenerating && generationProgress && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-sm font-medium text-blue-700">{generationProgress}</p>
                <p className="text-xs text-blue-600">This may take 30-60 seconds...</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Player */}
        {hasVideo && (
          <div className="space-y-3">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                className="w-full h-auto max-h-96"
                controls
                preload="metadata"
              />
            </div>
            
            {/* Video Status */}
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">
                Avatar video generated successfully
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
              💡 Generate voice first to create an avatar video
            </p>
          </div>
        )}

        {/* Video Generation Info */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">Video Generation Features:</h3>
          <ul className="text-sm text-foreground/70 space-y-1">
            <li>• Uses D-ID API for avatar video generation</li>
            <li>• Combines generated voice with persona images</li>
            <li>• High-quality talking avatar videos</li>
            <li>• Automatic caching and storage in Supabase</li>
            <li>• Local testing mode for quick demos</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 