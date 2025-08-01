'use client';

interface SuccessStoryStepProps {
  onDataUpdate?: (data: any) => void;
  formData?: any;
}

export default function SuccessStoryStep({ onDataUpdate, formData }: SuccessStoryStepProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Your <span className="text-gradient">Success Story</span>
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Here's what success looks like for brands like yours using celebrity AI avatars.
        </p>
      </div>

      {/* ROI Calculator Placeholder */}
      <div className="card-ponte p-8">
        <h3 className="text-xl font-semibold mb-6 text-center">ROI Calculator</h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400 mb-2">400%</div>
            <div className="text-sm text-foreground/70">Average Conversion Increase</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400 mb-2">$2.1M</div>
            <div className="text-sm text-foreground/70">Average Revenue Boost</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-2">285%</div>
            <div className="text-sm text-foreground/70">Engagement Increase</div>
          </div>
        </div>
      </div>

      {/* Success Cases */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-ponte p-6">
          <h4 className="font-semibold mb-3">FanDuel Success</h4>
          <p className="text-sm text-foreground/70 mb-3">
            Sports betting platform saw 400% increase in signups using Will Howard campaigns.
          </p>
          <div className="text-primary font-medium">$2.1M revenue boost</div>
        </div>

        <div className="card-ponte p-6">
          <h4 className="font-semibold mb-3">TechFlow Results</h4>
          <p className="text-sm text-foreground/70 mb-3">
            Software company achieved 285% video completion rates with Terry Crews.
          </p>
          <div className="text-primary font-medium">89% click-through rate</div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h4 className="font-semibold text-yellow-600 mb-2">🚧 Coming Soon</h4>
        <p className="text-sm text-foreground/70">
          Interactive ROI calculator and detailed case studies will be available in the next phase.
        </p>
      </div>
    </div>
  );
}