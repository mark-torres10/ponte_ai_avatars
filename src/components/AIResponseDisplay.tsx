'use client';

interface AIResponseDisplayProps {
  response: string | null;
  isGenerating: boolean;
  showResponse: boolean;
  onToggleResponse: () => void;
  onUseResponse?: (response: string) => void;
}

export default function AIResponseDisplay({ 
  response, 
  isGenerating, 
  showResponse, 
  onToggleResponse,
  onUseResponse 
}: AIResponseDisplayProps) {
  if (!response && !isGenerating) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Response Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground/80">
          AI Response
        </h3>
        <button
          onClick={onToggleResponse}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
        >
          {showResponse ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Response Content */}
      {showResponse && (
        <div className="space-y-4">
          {/* Loading State */}
          {isGenerating && (
            <div className="p-6 bg-muted/30 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-foreground/70">Generating AI response...</span>
              </div>
            </div>
          )}

          {/* Response Text */}
          {response && !isGenerating && (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={response}
                  readOnly
                  className="w-full h-32 p-4 border border-border rounded-lg bg-muted/20 text-foreground resize-none focus:outline-none cursor-default"
                  placeholder="AI response will appear here..."
                />
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
                    AI Generated
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {onUseResponse && (
                <div className="flex justify-center">
                  <button
                    onClick={() => onUseResponse(response)}
                    className="btn-primary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Use This Response for Voice & Video
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Response Status Indicator */}
      {response && (
        <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-600">
            AI response ready for voice and video generation
          </span>
        </div>
      )}
    </div>
  );
}
