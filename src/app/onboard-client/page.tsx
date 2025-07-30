import Navigation from "@/components/navigation"
import Link from "next/link"

export default function OnboardClientPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-ponte rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">👤</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Onboard as{" "}
                <span className="text-gradient">Talent</span>
              </h1>
              <p className="text-lg text-foreground/70 mb-8">
                Join our platform as a creator and monetize your likeness through AI avatar licensing.
              </p>
            </div>

            <div className="card-ponte p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
              <p className="text-foreground/70 mb-6">
                This feature is currently under development. Soon you&apos;ll be able to:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary text-xl">💰</span>
                  </div>
                  <h3 className="font-semibold mb-2">Earn Revenue</h3>
                  <p className="text-sm text-foreground/60">70% revenue sharing on all licensing fees</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary text-xl">🌍</span>
                  </div>
                  <h3 className="font-semibold mb-2">Global Reach</h3>
                  <p className="text-sm text-foreground/60">Access to international brand partnerships</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary text-xl">⚖️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Full Control</h3>
                  <p className="text-sm text-foreground/60">Complete control over usage rights</p>
                </div>
              </div>
              
              <p className="text-foreground/70">
                Our team is working hard to bring you the best AI avatar licensing platform. 
                Stay tuned for updates!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-talent"
                className="btn-primary-ponte text-base px-6 py-3 rounded-md font-medium"
              >
                Browse Avatars
              </Link>
              <Link
                href="/"
                className="btn-secondary-ponte text-base px-6 py-3 rounded-md font-medium"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 