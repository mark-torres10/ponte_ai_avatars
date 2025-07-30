import Navigation from "@/components/navigation"
import Link from "next/link"
import BackendStatus from "@/components/BackendStatus"

export default function GenerateAvatarPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-ponte rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🎬</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Generate{" "}
                <span className="text-gradient">Avatar</span>
              </h1>
              <p className="text-lg text-foreground/70 mb-8">
                Watch our AI avatar technology in action and see how we create compelling content.
              </p>
            </div>

            <div className="card-ponte p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">Demo Coming Soon</h2>
              <p className="text-foreground/70 mb-6">
                Experience our cutting-edge AI avatar generation technology. Soon you&apos;ll be able to:
              </p>
              
              {/* Backend Connection Test */}
              <div className="mb-8">
                <BackendStatus />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary text-xl">🎥</span>
                  </div>
                  <h3 className="font-semibold mb-2">Live Demo</h3>
                  <p className="text-sm text-foreground/60">See AI avatars in real-time action</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary text-xl">🎭</span>
                  </div>
                  <h3 className="font-semibold mb-2">Custom Content</h3>
                  <p className="text-sm text-foreground/60">Generate personalized avatar content</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary text-xl">⚡</span>
                  </div>
                  <h3 className="font-semibold mb-2">Instant Results</h3>
                  <p className="text-sm text-foreground/60">Get results in seconds, not hours</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-ponte-pink-400/20 to-ponte-pink-600/20 p-6 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Technology Preview</h3>
                <p className="text-sm text-foreground/70">
                  Our AI avatar generation combines advanced machine learning with ethical licensing practices. 
                  Each avatar is created with explicit consent and maintains the authentic personality of the original talent.
                </p>
              </div>
              
              <p className="text-foreground/70">
                Our development team is finalizing the demo experience. 
                Check back soon to see the future of AI avatar technology!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-talent"
                className="btn-primary-ponte text-base px-6 py-3 rounded-md font-medium"
              >
                Book an Avatar
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