'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { WizardStepProps } from '@/types/wizard';

export default function PremiumFeaturesStep({ onDataUpdate, formData }: WizardStepProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const premiumFeatures = [
    {
      id: 'multi-avatar',
      title: 'Multi-Avatar Campaigns',
      description: 'Dominate multiple audience segments with campaigns featuring both Terry Crews and Will Howard.',
      price: 3997,
      status: 'coming-soon',
      badge: 'Coming Soon'
    },
    {
      id: 'ab-testing',
      title: 'A/B Testing Suite',
      description: 'Optimize for maximum impact with data-driven insights and performance testing.',
      price: 500,
      status: 'beta',
      badge: 'Beta'
    },
    {
      id: 'creative-direction',
      title: 'Creative Direction',
      description: 'Perfect brand alignment with professional creative direction and customization.',
      price: 1000,
      status: 'available',
      badge: 'Available'
    },
    {
      id: 'rush-delivery',
      title: 'Rush Delivery',
      description: 'Launch before your competitors with 24-48 hour turnaround time.',
      price: 500,
      status: 'available',
      badge: 'Available'
    }
  ];

  const handleFeatureToggle = (featureId: string) => {
    const newSelected = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    setSelectedFeatures(newSelected);
    
    if (onDataUpdate) {
      onDataUpdate({
        ...formData,
        selectedPremiumFeatures: newSelected
      });
    }
  };

  const totalPrice = 1997 + selectedFeatures.reduce((sum, featureId) => {
    const feature = premiumFeatures.find(f => f.id === featureId);
    return sum + (feature?.price || 0);
  }, 0);

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
        {premiumFeatures.map((feature) => (
          <button
            key={feature.id}
            onClick={() => feature.status === 'available' && handleFeatureToggle(feature.id)}
            disabled={feature.status !== 'available'}
            className={cn(
              "card-ponte p-6 text-left transition-all duration-200",
              feature.status === 'available' && "cursor-pointer hover:scale-105",
              selectedFeatures.includes(feature.id) && "ring-2 ring-primary/50 bg-primary/5",
              feature.status !== 'available' && "opacity-60 cursor-not-allowed"
            )}
          >
            <div className="flex items-center mb-4">
              <span className={cn(
                "text-white text-xs px-3 py-1 rounded-full font-medium mr-3",
                feature.status === 'coming-soon' && "bg-gradient-ponte",
                feature.status === 'beta' && "bg-gradient-ponte",
                feature.status === 'available' && "bg-primary"
              )}>
                {feature.badge}
              </span>
              <h3 className="font-semibold">{feature.title}</h3>
            </div>
            <p className="text-sm text-foreground/70 mb-4">
              {feature.description}
            </p>
            <div className="text-primary font-medium">
              {feature.id === 'multi-avatar' ? `Starting at $${feature.price.toLocaleString()}` : `+$${feature.price} add-on`}
            </div>
            {selectedFeatures.includes(feature.id) && (
              <div className="mt-2 text-green-500 text-sm">✓ Selected</div>
            )}
          </button>
        ))}
      </div>

      {/* Total Price Display */}
      {selectedFeatures.length > 0 && (
        <div className="card-ponte p-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total with Add-ons:</span>
            <span className="text-primary font-bold text-xl">${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

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