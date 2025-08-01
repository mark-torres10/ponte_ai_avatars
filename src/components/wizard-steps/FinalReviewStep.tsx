'use client';

interface FormData {
  [key: string]: unknown;
}

interface FinalReviewStepProps {
  onDataUpdate?: (data: FormData) => void;
  onComplete?: () => void;
  formData?: FormData;
}

export default function FinalReviewStep({ onDataUpdate, onComplete, formData }: FinalReviewStepProps) {
  // Note: onDataUpdate is available for future use
  console.log('Final review data:', { onDataUpdate, formData });

  const handleSubmit = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to <span className="text-gradient">Launch?</span>
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Your campaign is ready to transform your brand. Review your selections and launch your success story.
        </p>
      </div>

      {/* Campaign Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-ponte p-6">
          <h3 className="font-semibold mb-4">Your Campaign Summary</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-foreground/60">Selected Avatar:</span>
              <div className="font-medium">
                {formData?.selectedAvatar && typeof formData.selectedAvatar === 'object' 
                  ? (formData.selectedAvatar as { name?: string }).name 
                  : 'Not selected'}
              </div>
            </div>
            <div>
              <span className="text-sm text-foreground/60">Brand Mission:</span>
              <div className="text-sm">{(formData?.brandMission as string) || 'Not provided'}</div>
            </div>
            <div>
              <span className="text-sm text-foreground/60">Campaign Type:</span>
              <div className="font-medium">Standard Campaign</div>
            </div>
          </div>
        </div>

        <div className="card-ponte p-6">
          <h3 className="font-semibold mb-4">Pricing</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Base Campaign</span>
              <span className="font-medium">$1,997</span>
            </div>
            <div className="flex justify-between">
              <span>Rush Delivery (optional)</span>
              <span className="text-foreground/60">+$500</span>
            </div>
            <div className="flex justify-between">
              <span>Creative Direction (optional)</span>
              <span className="text-foreground/60">+$1,000</span>
            </div>
            <div className="border-t border-white/20 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">$1,997</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rush Delivery Option */}
      <div className="card-ponte p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold mb-2">🚀 Rush Delivery Available</h4>
            <p className="text-sm text-foreground/70">
              Don&apos;t let your competitors get there first! Get your campaign delivered in 24-48 hours.
            </p>
          </div>
          <button className="btn-secondary-ponte px-4 py-2 rounded-md text-sm">
            Add Rush (+$500)
          </button>
        </div>
      </div>

      {/* Ongoing Management Offer */}
      <div className="card-ponte p-6">
        <div className="text-center">
          <h4 className="font-semibold mb-2">🎯 Ongoing Campaign Management</h4>
          <p className="text-sm text-foreground/70 mb-4">
            Ready to dominate your market? Our ongoing campaign management includes monthly content creation, 
            performance tracking, and optimization.
          </p>
          <div className="text-primary font-medium mb-3">Starting at $2,000/month</div>
          <button className="btn-secondary-ponte px-6 py-2 rounded-md text-sm">
            Learn More
          </button>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="btn-primary-ponte text-lg px-12 py-4 rounded-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Launch My Campaign ✨
        </button>
        <p className="text-sm text-foreground/60 mt-4">
          30-day money-back guarantee • Premium support included
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h4 className="font-semibold text-yellow-600 mb-2">🚧 Development Phase</h4>
        <p className="text-sm text-foreground/70">
          Payment processing and backend integration will be implemented in future phases.
        </p>
      </div>
    </div>
  );
}