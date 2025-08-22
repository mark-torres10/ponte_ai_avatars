'use client';

interface PreSelectedQuestionsProps {
  onQuestionSelect: (question: string) => void;
  disabled?: boolean;
}

const PROFESSIONAL_QUESTIONS = [
  "What's your biggest piece of advice for someone starting their first business?",
  "How do you handle setbacks and failures in entrepreneurship?",
  "What's the most important lesson you've learned about building a team?",
  "How do you stay motivated during challenging times in business?"
];

export default function PreSelectedQuestions({ onQuestionSelect, disabled = false }: PreSelectedQuestionsProps) {
  const handleQuestionClick = (question: string) => {
    if (!disabled) {
      onQuestionSelect(question);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-3 text-foreground/80">
          Quick Questions
        </h3>
        <p className="text-sm text-foreground/60 mb-4">
          Click any question below to get started quickly
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROFESSIONAL_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(question)}
            disabled={disabled}
            className="p-4 text-left bg-muted/30 hover:bg-muted/50 border border-border rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                {question}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
