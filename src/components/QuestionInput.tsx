'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Persona } from '@/lib/personas';
import PreSelectedQuestions from './PreSelectedQuestions';
import AIResponseDisplay from './AIResponseDisplay';

interface QuestionInputProps {
  selectedPersona: Persona | null;
  onQuestionChange: (question: string) => void;
  onResponseGenerated?: (response: string) => void;
}

export default function QuestionInput({ selectedPersona, onQuestionChange, onResponseGenerated }: QuestionInputProps) {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with placeholder question
  useEffect(() => {
    const placeholderQuestion = "What's your biggest piece of advice for someone starting their first business?";
    setQuestion(placeholderQuestion);
    onQuestionChange(placeholderQuestion);
  }, [onQuestionChange]);

  // Handle Ctrl+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (aiResponse && onResponseGenerated) {
          onResponseGenerated(aiResponse);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [aiResponse, onResponseGenerated]);

  const handleQuestionChange = (text: string) => {
    setQuestion(text);
    setError(null);
    onQuestionChange(text);
  };

  const handlePreSelectedQuestion = (selectedQuestion: string) => {
    setQuestion(selectedQuestion);
    setError(null);
    onQuestionChange(selectedQuestion);
  };

  const handleGenerateResponse = async () => {
    if (!selectedPersona) {
      setError('Please select a persona first');
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question to generate a response');
      return;
    }

    setIsGeneratingResponse(true);
    setError(null);

    try {
      // For now, we'll use the existing personalization endpoint
      // This will be replaced with the new question-to-response endpoint in Phase 2
      const response = await apiClient.personalizeText(question, selectedPersona.id);
      
      if (response.success && response.data) {
        setAiResponse(response.data.personalizedText);
        setShowResponse(true);
        if (onResponseGenerated) {
          onResponseGenerated(response.data.personalizedText);
        }
      } else {
        setError(response.error as string || 'Failed to generate AI response');
      }
    } catch (err) {
      console.error('AI response generation error:', err);
      setError('Failed to connect to AI service. Please try again.');
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleToggleResponse = () => {
    setShowResponse(!showResponse);
  };

  const handleUseResponse = (response: string) => {
    if (onResponseGenerated) {
      onResponseGenerated(response);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ask Your <span className="text-gradient">Question</span>
        </h2>
        <p className="text-foreground/70 mb-6">
          Ask a question and let AI generate an authentic response for your selected avatar
        </p>
      </div>

      {/* Pre-selected Questions */}
      <PreSelectedQuestions 
        onQuestionSelect={handlePreSelectedQuestion}
        disabled={!selectedPersona}
      />

      {/* Question Input */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Ask your question here... (max 1000 characters)"
            className="w-full h-32 p-4 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            maxLength={1000}
            disabled={isGeneratingResponse}
          />
          <div className="absolute bottom-2 right-2 text-xs text-foreground/50">
            {question.length}/1000
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
            onClick={handleGenerateResponse}
            disabled={!selectedPersona || !question.trim() || isGeneratingResponse}
            className="btn-primary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            {isGeneratingResponse ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating AI Response...
              </div>
            ) : (
              'Generate AI Response'
            )}
          </button>
        </div>

        {/* Persona Requirement */}
        {!selectedPersona && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-600 text-sm">
              ⚠️ Please select a persona above to enable AI response generation
            </p>
          </div>
        )}
      </div>

      {/* AI Response Display */}
      <AIResponseDisplay
        response={aiResponse}
        isGenerating={isGeneratingResponse}
        showResponse={showResponse}
        onToggleResponse={handleToggleResponse}
        onUseResponse={handleUseResponse}
      />
    </div>
  );
}
