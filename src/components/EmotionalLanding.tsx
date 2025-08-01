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
  icon: string;
}

const successMetrics: SuccessMetric[] = [
  {
    id: 'conversion',
    metric: 'Conversion Rate',
    value: '+400%',
    description: 'FanDuel signups with Will Howard',
    color: 'text-green-400',
    icon: '📈'
  },
  {
    id: 'engagement',
    metric: 'Engagement',
    value: '+285%',
    description: 'Video completion rates',
    color: 'text-blue-400',
    icon: '🎯'
  },
  {
    id: 'roi',
    metric: 'ROI',
    value: '850%',
    description: 'Return on investment',
    color: 'text-yellow-400',
    icon: '💰'
  },
  {
    id: 'reach',
    metric: 'Reach',
    value: '2.4M+',
    description: 'Audience reached',
    color: 'text-purple-400',
    icon: '🌍'
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
    <div className="relative min-h-screen">
      {/* Background Video Section */}
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-background/40 via-background/60 to-background/80 rounded-2xl mb-8 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/background-video-poster.jpg"
        >
          <source src="/videos/background-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-ponte-gradient-from/20 to-ponte-gradient-to/20" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-ponte rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl md:text-2xl font-bold">▶</span>
            </div>
            <p className="text-sm md:text-base text-foreground/60 font-medium">
              Click to play background video
            </p>
          </div>
        </div>
      </div>

      {/* Success Metrics Grid - Now properly contained */}
      <div className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {successMetrics.map((metric) => (
            <div
              key={metric.id}
              className="group relative bg-card-ponte border border-border-ponte rounded-xl p-4 md:p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredMetric(metric.id)}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl mb-2">{metric.icon}</div>
                <div className={cn("text-xl md:text-2xl font-bold mb-1", metric.color)}>
                  {metric.value}
                </div>
                <div className="text-sm md:text-base font-semibold text-foreground mb-1">
                  {metric.metric}
                </div>
                <div className="text-xs md:text-sm text-foreground/60 leading-tight">
                  {metric.description}
                </div>
              </div>
              
              {/* Hover effect */}
              {hoveredMetric === metric.id && (
                <div className="absolute inset-0 bg-primary/5 rounded-xl border-2 border-primary/20 flex items-center justify-center">
                  <div className="text-primary font-semibold text-sm">Learn More</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
          Transform Your Brand with{' '}
          <span className="text-gradient bg-clip-text text-transparent">
            Celebrity AI Avatars
          </span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 mb-8 max-w-4xl mx-auto leading-relaxed">
          Join industry leaders who&apos;ve revolutionized their marketing with authentic AI avatar campaigns. 
          Your breakthrough moment starts here.
        </p>
      </div>

      {/* Success Story Carousel - Improved Design */}
      <div className="mb-12">
        <div className="bg-card-ponte border border-border-ponte rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-lg">
          {/* Story Navigation Dots */}
          <div className="flex justify-center space-x-3 mb-6">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStoryIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 hover:scale-125",
                  index === currentStoryIndex
                    ? "bg-primary scale-125 shadow-lg"
                    : "bg-secondary hover:bg-primary/50"
                )}
                aria-label={`View success story ${index + 1}`}
              />
            ))}
          </div>

          {/* Story Content */}
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                {currentStory.company}
              </h3>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 mb-4">
                <span className="text-lg md:text-xl font-semibold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                  {currentStory.result}
                </span>
                <span className="text-lg md:text-xl font-semibold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                  {currentStory.metric}
                </span>
              </div>
            </div>
            
            <blockquote className="text-lg md:text-xl text-foreground/80 italic mb-6 leading-relaxed">
              &quot;{currentStory.quote}&quot;
            </blockquote>
            
            <div className="text-sm md:text-base text-foreground/60">
              Powered by <span className="font-semibold text-primary">{currentStory.avatar}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Avatar Examples - Improved Layout */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
        <div
          className="group relative bg-card-ponte border border-border-ponte rounded-2xl p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
          onMouseEnter={() => setHoveredMetric('terry-preview')}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl md:text-3xl font-bold">TC</span>
              </div>
              <p className="text-sm md:text-base font-medium text-foreground">Terry Crews Preview</p>
            </div>
            {hoveredMetric === 'terry-preview' && (
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <button className="btn-primary-ponte px-6 py-3 rounded-lg font-semibold text-lg shadow-lg">
                  ▶ Watch Demo
                </button>
              </div>
            )}
          </div>
          <h4 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
            Hear Terry Crews Say Your Brand Name
          </h4>
          <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
            Experience the power of celebrity endorsement with authentic voice and personality
          </p>
        </div>

        <div
          className="group relative bg-card-ponte border border-border-ponte rounded-2xl p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
          onMouseEnter={() => setHoveredMetric('will-preview')}
          onMouseLeave={() => setHoveredMetric(null)}
        >
          <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10" />
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl md:text-3xl font-bold">WH</span>
              </div>
              <p className="text-sm md:text-base font-medium text-foreground">Will Howard Preview</p>
            </div>
            {hoveredMetric === 'will-preview' && (
              <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <button className="btn-primary-ponte px-6 py-3 rounded-lg font-semibold text-lg shadow-lg">
                  ▶ Watch Demo
                </button>
              </div>
            )}
          </div>
          <h4 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
            Will Howard Sports Connection
          </h4>
          <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
            Connect with sports fans through authentic NFL quarterback endorsement
          </p>
        </div>
      </div>

      {/* CTA Section - Enhanced */}
      <div className="text-center mb-12">
        <button
          onClick={handleGetStarted}
          className="btn-primary-ponte text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          Transform My Brand Now ✨
        </button>
        <p className="text-sm md:text-base text-foreground/60 mt-4 font-medium">
          Join 500+ brands that chose celebrity AI avatars • 2-minute setup
        </p>
      </div>

      {/* Premium Feature Tease - Improved Design */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6 md:p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="bg-gradient-ponte text-white text-sm md:text-base px-4 py-2 rounded-full font-semibold shadow-lg">
            Coming Soon
          </span>
        </div>
        <h4 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
          Multi-Avatar Campaigns
        </h4>
        <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
          Want to dominate multiple audience segments? Our premium multi-avatar campaigns are coming soon!
        </p>
      </div>
    </div>
  );
}