'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: { 'terry-crews': number; 'will-howard': number };
  }[];
}

interface PersonalityQuizProps {
  onComplete: (results: { persona: string; score: number }) => void;
  onDataUpdate?: (data: Record<string, unknown>) => void;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'brand-personality',
    question: 'What best describes your brand\'s personality?',
    options: [
      {
        value: 'authoritative',
        label: 'Authoritative and commanding',
        score: { 'terry-crews': 3, 'will-howard': 1 }
      },
      {
        value: 'energetic',
        label: 'Energetic and motivational',
        score: { 'terry-crews': 2, 'will-howard': 2 }
      },
      {
        value: 'sports-focused',
        label: 'Sports-focused and competitive',
        score: { 'terry-crews': 1, 'will-howard': 3 }
      },
      {
        value: 'youthful',
        label: 'Youthful and relatable',
        score: { 'terry-crews': 1, 'will-howard': 2 }
      }
    ]
  },
  {
    id: 'target-audience',
    question: 'Who is your primary target audience?',
    options: [
      {
        value: 'professionals',
        label: 'Business professionals and executives',
        score: { 'terry-crews': 3, 'will-howard': 1 }
      },
      {
        value: 'sports-fans',
        label: 'Sports fans and athletes',
        score: { 'terry-crews': 1, 'will-howard': 3 }
      },
      {
        value: 'young-adults',
        label: 'Young adults (18-35)',
        score: { 'terry-crews': 2, 'will-howard': 2 }
      },
      {
        value: 'general',
        label: 'General consumer audience',
        score: { 'terry-crews': 2, 'will-howard': 2 }
      }
    ]
  },
  {
    id: 'campaign-goal',
    question: 'What is your main campaign goal?',
    options: [
      {
        value: 'trust',
        label: 'Build trust and credibility',
        score: { 'terry-crews': 3, 'will-howard': 1 }
      },
      {
        value: 'engagement',
        label: 'Increase engagement and excitement',
        score: { 'terry-crews': 2, 'will-howard': 2 }
      },
      {
        value: 'conversion',
        label: 'Drive conversions and sales',
        score: { 'terry-crews': 2, 'will-howard': 2 }
      },
      {
        value: 'awareness',
        label: 'Raise brand awareness',
        score: { 'terry-crews': 1, 'will-howard': 3 }
      }
    ]
  },
  {
    id: 'content-style',
    question: 'What type of content style do you prefer?',
    options: [
      {
        value: 'dramatic',
        label: 'Dramatic and impactful',
        score: { 'terry-crews': 3, 'will-howard': 1 }
      },
      {
        value: 'energetic',
        label: 'High-energy and motivational',
        score: { 'terry-crews': 2, 'will-howard': 2 }
      },
      {
        value: 'authentic',
        label: 'Authentic and genuine',
        score: { 'terry-crews': 1, 'will-howard': 3 }
      },
      {
        value: 'casual',
        label: 'Casual and approachable',
        score: { 'terry-crews': 1, 'will-howard': 2 }
      }
    ]
  },
  {
    id: 'industry',
    question: 'What industry is your brand in?',
    options: [
      {
        value: 'fitness',
        label: 'Fitness and wellness',
        score: { 'terry-crews': 2, 'will-howard': 2 }
      },
      {
        value: 'sports',
        label: 'Sports and athletics',
        score: { 'terry-crews': 1, 'will-howard': 3 }
      },
      {
        value: 'business',
        label: 'Business and professional services',
        score: { 'terry-crews': 3, 'will-howard': 1 }
      },
      {
        value: 'entertainment',
        label: 'Entertainment and media',
        score: { 'terry-crews': 2, 'will-howard': 2 }
      }
    ]
  }
];

export default function PersonalityQuiz({ onComplete, onDataUpdate }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (onDataUpdate) {
      onDataUpdate({ 
        quizAnswers: { ...answers, [questionId]: value },
        currentQuestion: currentQuestion + 1
      });
    }
  };

  const calculateResults = () => {
    let terryScore = 0;
    let willScore = 0;

    quizQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          terryScore += option.score['terry-crews'];
          willScore += option.score['will-howard'];
        }
      }
    });

    const persona = terryScore >= willScore ? 'terry-crews' : 'will-howard';
    const score = Math.max(terryScore, willScore);

    return { persona, score };
  };

  const handleComplete = () => {
    const results = calculateResults();
    setIsComplete(true);
    onComplete(results);
    
    if (onDataUpdate) {
      onDataUpdate({ 
        quizComplete: true,
        recommendedPersona: results.persona,
        quizScore: results.score
      });
    }
  };

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (isComplete) {
    const results = calculateResults();
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete! 🎉</h3>
          <p className="text-lg text-gray-600">
            Based on your answers, we recommend:
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            {results.persona === 'terry-crews' ? 'Terry Crews' : 'Will Howard'}
          </h4>
          <p className="text-gray-600">
            {results.persona === 'terry-crews' 
              ? 'The voice of authority and trust. When Terry speaks, people listen.'
              : 'The sports connection that drives fan engagement and loyalty.'
            }
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Match Score: {results.score}/15
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-ponte h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {currentQ.question}
        </h3>
        
        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(currentQ.id, option.value)}
              className={cn(
                "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                "hover:border-blue-300 hover:bg-blue-50",
                answers[currentQ.id] === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              )}
            >
              <span className="font-medium text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className={cn(
            "px-6 py-2 rounded-lg font-medium transition-colors",
            currentQuestion === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
        >
          Previous
        </button>
        
        {currentQuestion === quizQuestions.length - 1 ? (
          <button
            onClick={handleComplete}
            disabled={!answers[currentQ.id]}
            className={cn(
              "px-6 py-2 rounded-lg font-medium transition-colors",
              answers[currentQ.id]
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            Complete Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={!answers[currentQ.id]}
            className={cn(
              "px-6 py-2 rounded-lg font-medium transition-colors",
              answers[currentQ.id]
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
} 