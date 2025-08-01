'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Persona, PERSONAS } from '@/lib/personas';
import { loadAvatarImages } from '@/lib/supabase-images';

interface FormData {
  [key: string]: unknown;
}

interface EnhancedAvatarSelectionProps {
  onAvatarSelect?: (persona: Persona) => void;
  onDataUpdate?: (data: FormData) => void;
  selectedPersona?: Persona | null;
}

interface PersonalityTrait {
  trait: string;
  description: string;
  icon: string;
}

const avatarPersonalities = {
  'terry-crews': {
    tagline: "The voice of authority and trust. When Terry speaks, people listen.",
    description: "Terry Crews brings unmatched energy, authenticity, and gravitas to your brand. His powerful presence commands attention while his genuine personality creates instant trust and connection with audiences.",
    traits: [
      { trait: "Authority", description: "Commands respect and attention", icon: "👑" },
      { trait: "Energy", description: "High-energy, motivational presence", icon: "⚡" },
      { trait: "Trust", description: "Authentic and genuine personality", icon: "🤝" },
      { trait: "Humor", description: "Charismatic and entertaining", icon: "😄" }
    ],
    bestFor: ["Fitness & Wellness", "Technology", "Entertainment", "Motivational Content"],
    voicePreview: "Terry Crews voice sample preview",
    personality: "Bold, confident, and inspiring - Terry motivates action"
  },
  'will-howard': {
    tagline: "The authentic sports connection. Will Howard connects with fans like no one else.",
    description: "Will Howard brings authentic sports credibility and genuine fan connection to your brand. His quarterback leadership and relatable personality resonate deeply with sports enthusiasts and competitive audiences.",
    traits: [
      { trait: "Leadership", description: "Natural leader and team player", icon: "🏆" },
      { trait: "Authenticity", description: "Genuine sports credibility", icon: "⭐" },
      { trait: "Connection", description: "Relates to fans and audiences", icon: "🤝" },
      { trait: "Performance", description: "High-pressure delivery", icon: "🎯" }
    ],
    bestFor: ["Sports & Gaming", "Financial Services", "Competition", "Performance Brands"],
    voicePreview: "Will Howard voice sample preview",
    personality: "Strategic, focused, and relatable - Will builds team spirit"
  }
};

const quizQuestions = [
  {
    id: 'energy-level',
    question: "What energy level best fits your brand?",
    options: [
      { value: 'high-energy', label: 'High-energy and bold', avatarMatch: 'terry-crews' },
      { value: 'focused-strategic', label: 'Focused and strategic', avatarMatch: 'will-howard' }
    ]
  },
  {
    id: 'audience-type',
    question: "Who is your primary audience?",
    options: [
      { value: 'general-motivation', label: 'People seeking motivation and inspiration', avatarMatch: 'terry-crews' },
      { value: 'sports-fans', label: 'Sports fans and competitive audiences', avatarMatch: 'will-howard' }
    ]
  },
  {
    id: 'brand-personality',
    question: "How would you describe your brand personality?",
    options: [
      { value: 'bold-entertaining', label: 'Bold, entertaining, and energetic', avatarMatch: 'terry-crews' },
      { value: 'authentic-strategic', label: 'Authentic, strategic, and performance-focused', avatarMatch: 'will-howard' }
    ]
  },
  {
    id: 'content-style',
    question: "What style of content resonates with your audience?",
    options: [
      { value: 'motivational', label: 'Motivational and inspirational', avatarMatch: 'terry-crews' },
      { value: 'strategic', label: 'Strategic and results-oriented', avatarMatch: 'will-howard' }
    ]
  },
  {
    id: 'industry-focus',
    question: "Which industry best describes your focus?",
    options: [
      { value: 'lifestyle-tech', label: 'Lifestyle, fitness, or technology', avatarMatch: 'terry-crews' },
      { value: 'sports-finance', label: 'Sports, gaming, or financial services', avatarMatch: 'will-howard' }
    ]
  }
];

export default function EnhancedAvatarSelection({ 
  onAvatarSelect, 
  onDataUpdate, 
  selectedPersona 
}: EnhancedAvatarSelectionProps) {
  const [personas, setPersonas] = useState<Persona[]>(PERSONAS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);

  // Load avatar images from Supabase
  const loadImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      
      const avatarImages = await loadAvatarImages();
      
      const updatedPersonas = personas.map(persona => ({
        ...persona,
        images: avatarImages[persona.id] || persona.images
      }));
      
      setPersonas(updatedPersonas);
      
    } catch (error) {
      console.error('Failed to load avatar images:', error);
      setLoadError('Failed to load avatar images. Using fallback images.');
    } finally {
      setIsLoading(false);
    }
  }, [personas]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handlePersonaSelect = (personaId: string) => {
    const updatedPersonas = personas.map(persona => ({
      ...persona,
      selected: persona.id === personaId
    }));
    
    setPersonas(updatedPersonas);
    const selectedPersona = updatedPersonas.find(p => p.id === personaId);
    
    if (onAvatarSelect && selectedPersona) {
      onAvatarSelect(selectedPersona);
    }
    
    if (onDataUpdate) {
      onDataUpdate({
        selectedAvatar: selectedPersona,
        selectionTime: Date.now(),
        quizCompleted: quizResult !== null,
        quizAnswers: quizAnswers
      });
    }
  };

  const handleVoicePreview = (personaId: string) => {
    setPlayingVoice(personaId);
    // Simulate voice playing
    setTimeout(() => {
      setPlayingVoice(null);
    }, 3000);
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...quizAnswers, [questionId]: answer };
    setQuizAnswers(newAnswers);
    
    // Calculate quiz result
    if (Object.keys(newAnswers).length === quizQuestions.length) {
      const scores = { 'terry-crews': 0, 'will-howard': 0 };
      
      Object.entries(newAnswers).forEach(([questionId, answer]) => {
        const question = quizQuestions.find(q => q.id === questionId);
        const option = question?.options.find(o => o.value === answer);
        if (option) {
          scores[option.avatarMatch as keyof typeof scores]++;
        }
      });
      
      const recommendedAvatar = scores['terry-crews'] > scores['will-howard'] ? 'terry-crews' : 'will-howard';
      setQuizResult(recommendedAvatar);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizResult(null);
    setShowQuiz(false);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-foreground/70">Loading your perfect matches...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Meet Your <span className="text-gradient">Perfect Match</span>
        </h2>
        <p className="text-lg text-foreground/70 mb-6 max-w-2xl mx-auto">
          Choose the celebrity AI avatar that best represents your brand&apos;s personality and connects with your audience.
        </p>
        
        {/* Quiz Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="btn-secondary-ponte px-6 py-2 rounded-md font-medium"
          >
            {showQuiz ? '← Back to Avatars' : '🧠 Take Personality Quiz'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {loadError && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-600 text-sm">{loadError}</p>
        </div>
      )}

      {/* Personality Quiz */}
      {showQuiz && (
        <div className="max-w-2xl mx-auto">
          <div className="card-ponte p-8">
            <h3 className="text-xl font-bold mb-6 text-center">Find Your Perfect Avatar Match</h3>
            
            {quizQuestions.map((question, index) => (
              <div key={question.id} className="mb-6">
                <h4 className="font-medium mb-3">{index + 1}. {question.question}</h4>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200",
                        quizAnswers[question.id] === option.value
                          ? "bg-primary/20 border border-primary"
                          : "bg-secondary/30 hover:bg-secondary/50"
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={quizAnswers[question.id] === option.value}
                        onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            {quizResult && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">✨ Your Perfect Match!</h4>
                <p className="text-sm">
                  Based on your answers, <strong>{personas.find(p => p.id === quizResult)?.name}</strong> is your ideal avatar match!
                </p>
                <button
                  onClick={() => {
                    handlePersonaSelect(quizResult);
                    setShowQuiz(false);
                  }}
                  className="btn-primary-ponte mt-3 px-4 py-2 rounded-md text-sm"
                >
                  Select {personas.find(p => p.id === quizResult)?.name}
                </button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button
                onClick={resetQuiz}
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                Reset Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Selection Grid */}
      {!showQuiz && (
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {personas.map((persona) => {
            const personalityData = avatarPersonalities[persona.id as keyof typeof avatarPersonalities];
            const isSelected = persona.selected || selectedPersona?.id === persona.id;
            
            return (
              <div
                key={persona.id}
                className={cn(
                  "avatar-card cursor-pointer transition-all duration-300 relative",
                  isSelected
                    ? "ring-2 ring-primary shadow-xl scale-105"
                    : "hover:scale-105 hover:shadow-lg"
                )}
                onClick={() => handlePersonaSelect(persona.id)}
                onMouseEnter={() => setHoveredPersona(persona.id)}
                onMouseLeave={() => setHoveredPersona(null)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}

                {/* Avatar Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{persona.name}</h3>
                  <p className="text-primary font-medium mb-2">{personalityData.tagline}</p>
                  <p className="text-foreground/70 text-sm">{personalityData.description}</p>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {persona.images.slice(0, 4).map((image, index) => {
                    const imageUrl = typeof image === 'string' ? image : image.url;
                    const imageAlt = typeof image === 'string' 
                      ? `${persona.name} - Image ${index + 1}` 
                      : image.alt;
                    
                    return (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden relative group"
                      >
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 25vw, 15vw"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Personality Traits */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Personality Traits:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {personalityData.traits.map((trait, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-secondary/30 rounded-lg"
                      >
                        <span className="text-lg">{trait.icon}</span>
                        <div>
                          <div className="text-sm font-medium">{trait.trait}</div>
                          <div className="text-xs text-foreground/60">{trait.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voice Preview */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Voice Preview:</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVoicePreview(persona.id);
                      }}
                      className={cn(
                        "btn-secondary-ponte px-3 py-1 rounded-md text-sm transition-all duration-200",
                        playingVoice === persona.id && "bg-primary text-primary-foreground"
                      )}
                    >
                      {playingVoice === persona.id ? '⏸ Playing...' : '▶ Listen'}
                    </button>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm italic">
                      &quot;Hi, I&apos;m {persona.name}. I&apos;m excited to help bring your brand&apos;s message to life with authentic energy and connection.&quot;
                    </p>
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Perfect For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {personalityData.bestFor.map((category, index) => (
                      <span
                        key={index}
                        className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePersonaSelect(persona.id);
                  }}
                  className={cn(
                    "w-full py-3 rounded-md font-medium transition-all duration-200",
                    isSelected
                      ? "btn-primary-ponte"
                      : "btn-secondary-ponte hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  {isSelected ? '✓ Selected' : `Choose ${persona.name}`}
                </button>

                {/* Hover Effect */}
                {hoveredPersona === persona.id && !isSelected && (
                  <div className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quiz Result Recommendation */}
      {quizResult && !showQuiz && (
        <div className="text-center">
          <div className="card-ponte p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-primary mb-2">🎯 Quiz Recommendation</h4>
            <p className="text-sm text-foreground/70 mb-3">
              Based on your personality quiz, <strong>{personas.find(p => p.id === quizResult)?.name}</strong> is your perfect match!
            </p>
            <button
              onClick={() => handlePersonaSelect(quizResult)}
              className="btn-primary-ponte px-4 py-2 rounded-md text-sm"
            >
              Select Recommended Avatar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}