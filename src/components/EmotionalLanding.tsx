'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FormData {
  [key: string]: unknown;
}

interface EmotionalLandingProps {
  onContinue?: () => void;
  onDataUpdate?: (data: FormData) => void;
}

interface SuccessMetric {
  id: string;
  metric: string;
  value: string;
  description: string;
  color: string;
}

const successMetrics: SuccessMetric[] = [
  {
    id: 'conversion',
    metric: 'Conversion Rate',
    value: '+400%',
    description: 'FanDuel signups with Will Howard',
    color: 'text-green-400'
  },
  {
    id: 'engagement',
    metric: 'Engagement',
    value: '+285%',
    description: 'Video completion rates',
    color: 'text-blue-400'
  },
  {
    id: 'roi',
    metric: 'ROI',
    value: '850%',
    description: 'Return on investment',
    color: 'text-yellow-400'
  },
  {
    id: 'reach',
    metric: 'Reach',
    value: '2.4M+',
    description: 'Audience reached',
    color: 'text-purple-400'
  }
];

const successStories = [
  {
    company: 'FanDuel',
    avatar: 'Will Howard',
    result: '400% increase in signups',
    metric: '$2.1M revenue boost',
    quote: "Will Howard's authenticity connected with sports fans like nothing we've tried before."
  },
  {
    company: 'TechFlow',
    avatar: 'Terry Crews',
    result: '285% video completion',
    metric: '89% click-through rate',
    quote: "Terry's energy made our boring software exciting. Engagement went through the roof."
  },
  {
    company: 'FitnessPro',
    avatar: 'Terry Crews',
    result: '350% conversion rate',
    metric: '$1.8M in new memberships',
    quote: "Terry motivated our audience to action. The results exceeded our wildest expectations."
  }
];

export default function EmotionalLanding({ onContinue, onDataUpdate }: EmotionalLandingProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Auto-rotate success stories
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Floating animation for metrics
  useEffect(() => {
    const animateMetrics = () => {
      const metrics = document.querySelectorAll('.floating-metric');
      metrics.forEach((metric, index) => {
        const delay = index * 0.5;
        const duration = 3 + (index * 0.3);
        
        (metric as HTMLElement).style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
      });
    };

    const timer = setTimeout(animateMetrics, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (onDataUpdate) {
      onDataUpdate({
        landingInteraction: true,
        engagementTime: Date.now(),
        viewedStories: currentStoryIndex + 1
      });
    }
    if (onContinue) {
      onContinue();
    }
  };

  const currentStory = successStories[currentStoryIndex];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/60 to-background/80 z-10" />
        <div className="w-full h-full bg-gradient-to-r from-ponte-gradient-from/20 to-ponte-gradient-to/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-ponte rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">▶</span>
            </div>
            <p className="text-sm text-foreground/60">Background video loading...</p>
          </div>
        </div>
      </div>

      {/* Floating Success Metrics */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {successMetrics.map((metric, index) => (
          <div
            key={metric.id}
            className={cn(
              "floating-metric absolute card-ponte p-4 max-w-xs",
              index === 0 && "top-24 left-8",
              index === 1 && "top-32 right-12",
              index === 2 && "bottom-32 left-16",
              index === 3 && "bottom-24 right-8"
            )}
            style={{
              animationDelay: `${index * 0.5}s`
            }}
          >
            <div className="text-center">
              <div className={cn("text-2xl font-bold", metric.color)}>
                {metric.value}
              </div>
              <div className="text-sm font-medium text-foreground">
                {metric.metric}
              </div>
              <div className="text-xs text-foreground/60 mt-1">
                {metric.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-30 flex items-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Transform Your Brand with{' '}
                <span className="text-gradient">Celebrity AI Avatars</span>
              </h1>
              <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto">
                Join industry leaders who&apos;ve revolutionized their marketing with authentic AI avatar campaigns. 
                Your breakthrough moment starts here.
              </p>
            </div>

            {/* Success Story Carousel */}
            <div className="mb-12">
              <div className="card-ponte p-8 max-w-2xl mx-auto">
                <div className="mb-6">
                  <div className="flex justify-center space-x-2 mb-4">
                    {successStories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStoryIndex(index)}
                        className={cn(
                          "w-3 h-3 rounded-full transition-all duration-300",
                          index === currentStoryIndex
                            ? "bg-primary scale-125"
                            : "bg-secondary hover:bg-primary/50"
                        )}
                        aria-label={`View success story ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {currentStory.company}
                    </h3>
                    <div className="flex justify-center items-center space-x-4 mb-3">
                      <span className="text-lg font-semibold text-green-400">
                        {currentStory.result}
                      </span>
                      <span className="text-lg font-semibold text-yellow-400">
                        {currentStory.metric}
                      </span>
                    </div>
                  </div>
                  
                  <blockquote className="text-foreground/80 italic mb-4">
                    &quot;{currentStory.quote}&quot;
                  </blockquote>
                  
                  <div className="text-sm text-foreground/60">
                    Powered by <span className="font-semibold">{currentStory.avatar}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Examples */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div
                className="card-ponte p-6 cursor-pointer hover:scale-105 transition-all duration-300 group"
                onMouseEnter={() => setHoveredMetric('terry-preview')}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="aspect-video bg-secondary/30 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">TC</span>
                    </div>
                    <p className="text-sm font-medium">Terry Crews Preview</p>
                  </div>
                  {hoveredMetric === 'terry-preview' && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <button className="btn-primary-ponte px-4 py-2 rounded-md font-medium">
                        ▶ Watch Demo
                      </button>
                    </div>
                  )}
                </div>
                <h4 className="font-semibold mb-2">Hear Terry Crews Say Your Brand Name</h4>
                <p className="text-sm text-foreground/70">
                  Experience the power of celebrity endorsement with authentic voice and personality
                </p>
              </div>

              <div
                className="card-ponte p-6 cursor-pointer hover:scale-105 transition-all duration-300 group"
                onMouseEnter={() => setHoveredMetric('will-preview')}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="aspect-video bg-secondary/30 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20" />
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">WH</span>
                    </div>
                    <p className="text-sm font-medium">Will Howard Preview</p>
                  </div>
                  {hoveredMetric === 'will-preview' && (
                    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                      <button className="btn-primary-ponte px-4 py-2 rounded-md font-medium">
                        ▶ Watch Demo
                      </button>
                    </div>
                  )}
                </div>
                <h4 className="font-semibold mb-2">Will Howard Sports Connection</h4>
                <p className="text-sm text-foreground/70">
                  Connect with sports fans through authentic NFL quarterback endorsement
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <button
                onClick={handleGetStarted}
                className="btn-primary-ponte text-lg px-12 py-4 rounded-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Transform My Brand Now ✨
              </button>
              <p className="text-sm text-foreground/60 mt-4">
                Join 500+ brands that chose celebrity AI avatars • 2-minute setup
              </p>
            </div>

            {/* Premium Feature Tease */}
            <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center mb-3">
                <span className="bg-gradient-ponte text-white text-xs px-3 py-1 rounded-full font-medium">
                  Coming Soon
                </span>
              </div>
              <h4 className="font-semibold mb-2">Multi-Avatar Campaigns</h4>
              <p className="text-sm text-foreground/70">
                Want to dominate multiple audience segments? Our premium multi-avatar campaigns are coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(1deg);
          }
          50% {
            transform: translateY(0px) rotate(0deg);
          }
          75% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }

        .floating-metric {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}