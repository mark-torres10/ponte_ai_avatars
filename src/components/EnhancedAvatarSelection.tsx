'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Persona, PERSONAS } from '@/lib/personas';

interface FormData {
  [key: string]: unknown;
}

interface EnhancedAvatarSelectionProps {
  onAvatarSelect?: (persona: Persona) => void;
  onDataUpdate?: (data: FormData) => void;
  selectedPersona?: Persona | null;
  avatarImages?: Record<string, unknown>;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

interface PersonalityTrait {
  trait: string;
  description: string;
  icon: string;
}

const avatarPersonalities = {
  'terry-crews': {
    tagline: "The voice of authority and trust. When Terry speaks, people listen.",
    description: "Terry Crews brings unmatched energy, authenticity, and gravitas to your brand. His commanding presence and genuine personality create instant trust and engagement.",
    traits: [
      { trait: "Authority", description: "Commands attention and respect", icon: "👑" },
      { trait: "Energy", description: "High-energy and motivational", icon: "⚡" },
      { trait: "Authenticity", description: "Genuine and relatable", icon: "💎" },
      { trait: "Trust", description: "Builds instant credibility", icon: "🤝" }
    ] as PersonalityTrait[]
  },
  'will-howard': {
    tagline: "The sports connection that drives fan engagement and loyalty.",
    description: "Will Howard connects with sports fans through authentic NFL quarterback endorsement. His athletic credibility and fan following create powerful brand connections.",
    traits: [
      { trait: "Athletic", description: "Sports credibility and appeal", icon: "🏈" },
      { trait: "Youthful", description: "Connects with younger audiences", icon: "🌟" },
      { trait: "Competitive", description: "Drives performance and results", icon: "🏆" },
      { trait: "Relatable", description: "Approachable and authentic", icon: "👤" }
    ] as PersonalityTrait[]
  }
};

export default function EnhancedAvatarSelection({ 
  onAvatarSelect, 
  onDataUpdate, 
  selectedPersona,
  avatarImages,
  loading = false,
  error = null,
  onRetry
}: EnhancedAvatarSelectionProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    selectedPersona?.id || null
  );

  // Handle persona selection
  const handlePersonaSelect = useCallback((persona: Persona) => {
    setSelectedPersonaId(persona.id);
    onAvatarSelect?.(persona);
    onDataUpdate?.({ selectedPersona: persona });
  }, [onAvatarSelect, onDataUpdate]);

  // Memoized persona cards to prevent unnecessary re-renders
  const personaCards = useMemo(() => {
    if (!avatarImages || loading) {
      return PERSONAS.map(persona => (
        <div key={persona.id} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-64 w-full"></div>
        </div>
      ));
    }

    return PERSONAS.map(persona => {
      const images = (avatarImages as Record<string, any>)?.[persona.id] || [];
      const personality = avatarPersonalities[persona.id as keyof typeof avatarPersonalities];
      const isSelected = selectedPersonaId === persona.id;

      return (
        <div
          key={persona.id}
          className={cn(
            "relative group cursor-pointer transition-all duration-300 transform hover:scale-105",
            "bg-white rounded-xl shadow-lg overflow-hidden border-2",
            isSelected 
              ? "border-blue-500 shadow-blue-200" 
              : "border-gray-200 hover:border-blue-300"
          )}
          onClick={() => handlePersonaSelect(persona)}
        >
          {/* Avatar Image */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            {images.length > 0 ? (
              <Image
                src={images[0].url}
                alt={images[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-4xl font-bold text-gray-400">
                  {persona.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            )}
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900">{persona.name}</h3>
              <span className="text-sm text-gray-500">AI Avatar</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {personality?.tagline || persona.description}
            </p>

            {/* Personality Traits */}
            <div className="space-y-2">
              {personality?.traits.slice(0, 2).map((trait, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-lg">{trait.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{trait.trait}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-4">
              <button
                className={cn(
                  "w-full py-2 px-4 rounded-lg font-medium transition-colors",
                  isSelected
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => handlePersonaSelect(persona)}
              >
                {isSelected ? "Selected" : "Select Avatar"}
              </button>
              
              {/* Voice Demo Button */}
              <button
                className="w-full py-2 px-4 rounded-lg font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center justify-center space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  const audio = new Audio(`/audio/${persona.id}-voice.mp3`);
                  audio.play().catch(() => {
                    // Fallback for browsers that block autoplay
                    console.log('Audio playback blocked');
                  });
                }}
              >
                <span>🎵</span>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      );
    });
  }, [avatarImages, loading, selectedPersonaId, handlePersonaSelect]);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your AI Avatar 🎭
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the perfect AI avatar that matches your brand&apos;s personality and target audience. 
          Each avatar brings unique traits and engagement potential.
        </p>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {personaCards}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading avatar options...</p>
        </div>
      )}

      {/* Selection Summary */}
      {selectedPersonaId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Selected Avatar: {PERSONAS.find(p => p.id === selectedPersonaId)?.name}
          </h3>
          <p className="text-blue-700">
            {avatarPersonalities[selectedPersonaId as keyof typeof avatarPersonalities]?.description}
          </p>
        </div>
      )}
    </div>
  );
}