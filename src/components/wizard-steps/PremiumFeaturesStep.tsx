'use client';

interface PremiumFeaturesStepProps {
  onDataUpdate?: (data: any) => void;
  formData?: any;
}

export default function PremiumFeaturesStep({ onDataUpdate, formData }: PremiumFeaturesStepProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Amplify Your <span className="text-gradient">Impact</span>
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Want even bigger results? Unlock premium features to dominate your market.
        </p>
      </div>

      {/* Premium Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-ponte p-6">
          <div className="flex items-center mb-4">
            <span className="bg-gradient-ponte text-white text-xs px-3 py-1 rounded-full font-medium mr-3">
              Coming Soon
            </span>
            <h3 className="font-semibold">Multi-Avatar Campaigns</h3>
          </div>
          <p className="text-sm text-foreground/70 mb-4">
            Dominate multiple audience segments with campaigns featuring both Terry Crews and Will Howard.
          </p>
          <div className="text-primary font-medium">Starting at $3,997</div>
        </div>

        <div className="card-ponte p-6">
          <div className="flex items-center mb-4">
            <span className="bg-gradient-ponte text-white text-xs px-3 py-1 rounded-full font-medium mr-3">
              Beta
            </span>
            <h3 className="font-semibold">A/B Testing Suite</h3>
          </div>
          <p className="text-sm text-foreground/70 mb-4">
            Optimize for maximum impact with data-driven insights and performance testing.
          </p>
          <div className="text-primary font-medium">+$500 add-on</div>
        </div>

        <div className="card-ponte p-6">
          <div className="flex items-center mb-4">
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium mr-3">
              Available
            </span>
            <h3 className="font-semibold">Creative Direction</h3>
          </div>
          <p className="text-sm text-foreground/70 mb-4">
            Perfect brand alignment with professional creative direction and customization.
          </p>
          <div className="text-primary font-medium">+$1,000 add-on</div>
        </div>

        <div className="card-ponte p-6">
          <div className="flex items-center mb-4">
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium mr-3">
              Available
            </span>
            <h3 className="font-semibold">Rush Delivery</h3>
          </div>
          <p className="text-sm text-foreground/70 mb-4">
            Launch before your competitors with 24-48 hour turnaround time.
          </p>
          <div className="text-primary font-medium">+$500 add-on</div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h4 className="font-semibold text-yellow-600 mb-2">🚧 Coming Soon</h4>
        <p className="text-sm text-foreground/70">
          Premium feature selection and pricing will be available in the next phase.
        </p>
      </div>
    </div>
  );
}