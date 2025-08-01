'use client';

interface BrandCustomizationStepProps {
  onDataUpdate?: (data: any) => void;
  formData?: any;
}

export default function BrandCustomizationStep({ onDataUpdate, formData }: BrandCustomizationStepProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Make It <span className="text-gradient">Perfect</span>
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Let's make your avatar campaign perfectly aligned with your brand identity.
        </p>
      </div>

      {/* Brand Customization Options */}
      <div className="space-y-6">
        <div className="card-ponte p-6">
          <h3 className="font-semibold mb-4">Brand Voice Customization</h3>
          <p className="text-sm text-foreground/70 mb-4">
            Fine-tune your avatar's speaking style to match your brand's unique voice and personality.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 bg-secondary/30 rounded-lg text-center">
              <div className="font-medium">Professional</div>
              <div className="text-xs text-foreground/60">Formal & Authoritative</div>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg text-center">
              <div className="font-medium">Casual</div>
              <div className="text-xs text-foreground/60">Friendly & Approachable</div>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg text-center">
              <div className="font-medium">Energetic</div>
              <div className="text-xs text-foreground/60">Dynamic & Motivational</div>
            </div>
          </div>
        </div>

        <div className="card-ponte p-6">
          <h3 className="font-semibold mb-4">Visual Style Matching</h3>
          <p className="text-sm text-foreground/70 mb-4">
            Ensure your avatar's appearance perfectly complements your brand's visual identity.
          </p>
          <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center">
            <p className="text-foreground/60">Brand alignment preview loading...</p>
          </div>
        </div>

        <div className="card-ponte p-6">
          <h3 className="font-semibold mb-4">Competitive Differentiation</h3>
          <p className="text-sm text-foreground/70 mb-4">
            Position your brand uniquely in the market with strategic messaging and positioning.
          </p>
          <textarea
            placeholder="Describe how you want to differentiate from competitors..."
            rows={3}
            className="w-full px-4 py-3 bg-background border border-white/20 rounded-md text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-primary resize-none"
          />
        </div>
      </div>

      {/* Premium Upsell */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
        <div className="text-center">
          <h4 className="font-semibold mb-2">Premium Creative Direction</h4>
          <p className="text-sm text-foreground/70 mb-4">
            Work with our creative team for perfect brand alignment, competitive differentiation, and professional polish.
          </p>
          <div className="text-primary font-medium mb-3">$1,000 add-on service</div>
          <button className="btn-primary-ponte px-6 py-2 rounded-md text-sm">
            Add Creative Direction
          </button>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h4 className="font-semibold text-yellow-600 mb-2">🚧 Coming Soon</h4>
        <p className="text-sm text-foreground/70">
          Interactive brand customization tools will be available in the next phase.
        </p>
      </div>
    </div>
  );
}