'use client';

interface FormData {
  [key: string]: unknown;
}

interface CampaignPreviewStepProps {
  onDataUpdate?: (data: FormData) => void;
  formData?: FormData;
}

export default function CampaignPreviewStep({ onDataUpdate, formData }: CampaignPreviewStepProps) {
  // Note: onDataUpdate and formData are available for future use
  console.log('Campaign preview data:', { onDataUpdate, formData });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          See Your <span className="text-gradient">Future</span>
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Here&apos;s how your campaign will look across different platforms with your chosen avatar.
        </p>
      </div>

      {/* Campaign Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-ponte p-6">
          <h3 className="font-semibold mb-4">Website Hero Section</h3>
          <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center">
            <p className="text-foreground/60">Campaign preview loading...</p>
          </div>
        </div>

        <div className="card-ponte p-6">
          <h3 className="font-semibold mb-4">Social Media Post</h3>
          <div className="aspect-square bg-secondary/30 rounded-lg flex items-center justify-center">
            <p className="text-foreground/60">Social preview loading...</p>
          </div>
        </div>

        <div className="card-ponte p-6">
          <h3 className="font-semibold mb-4">Video Ad</h3>
          <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center">
            <p className="text-foreground/60">Video preview loading...</p>
          </div>
        </div>

        <div className="card-ponte p-6">
          <h3 className="font-semibold mb-4">Email Campaign</h3>
          <div className="aspect-[4/5] bg-secondary/30 rounded-lg flex items-center justify-center">
            <p className="text-foreground/60">Email preview loading...</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h4 className="font-semibold text-yellow-600 mb-2">🚧 Coming Soon</h4>
        <p className="text-sm text-foreground/70">
          Real-time AI campaign generation will be available in the next phase of development.
        </p>
      </div>
    </div>
  );
}