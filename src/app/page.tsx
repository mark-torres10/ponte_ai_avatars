import Link from "next/link"
import Navigation from "@/components/navigation"

// Sample avatar data for the carousel
const sampleAvatars = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Tech Influencer",
    rating: "4.9",
    bookings: "1,250",
    price: "$2,500 - $15,000",
    tags: ["Product Launches", "Training Videos"],
    image: "/api/placeholder/300/400"
  },
  {
    id: 2,
    name: "Sarah Martinez",
    role: "Celebrity Chef",
    rating: "4.8",
    bookings: "890",
    price: "$3,000 - $20,000",
    tags: ["Food Campaigns", "Cooking Tutorials"],
    image: "/api/placeholder/300/400"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Professional Athlete",
    rating: "5.0",
    bookings: "2,100",
    price: "$5,000 - $35,000",
    tags: ["Sports Marketing", "Motivational Content"],
    image: "/api/placeholder/300/400"
  },
  {
    id: 4,
    name: "Emma Chen",
    role: "Podcast Host",
    rating: "4.7",
    bookings: "675",
    price: "$1,800 - $12,000",
    tags: ["Interview Style", "Educational Content"],
    image: "/api/placeholder/300/400"
  },
  {
    id: 5,
    name: "David Rodriguez",
    role: "Fitness Expert",
    rating: "4.9",
    bookings: "1,450",
    price: "$2,200 - $18,000",
    tags: ["Fitness Content", "Wellness Campaigns"],
    image: "/api/placeholder/300/400"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-ponte-radial opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 border border-primary/30 text-primary">
                AI Avatar Licensing Platform
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              License{" "}
              <span className="text-gradient">Iconic Personalities</span>
              <br />
              as AI Avatars
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto">
              Rent AI avatars of celebrities, athletes, and creators for your marketing campaigns. 
              The future of endorsements meets cutting-edge AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/request-talent"
                className="btn-primary-ponte text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium w-full sm:w-auto"
              >
                Explore Avatar Marketplace
              </Link>
              <Link
                href="/generate-avatar"
                className="btn-secondary-ponte text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium w-full sm:w-auto"
              >
                Watch Demo
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-12 text-sm sm:text-base">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-foreground/60">Trusted by 500+ brands</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-foreground/60">200+ AI avatars available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-foreground/60">Ethical AI licensing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avatar Showcase Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Premium AI Avatar{" "}
              <span className="text-gradient">Marketplace</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Browse our curated collection of AI avatars from celebrities, athletes, creators, and industry experts. 
              Each avatar is ethically licensed with full rights management.
            </p>
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {sampleAvatars.map((avatar) => (
              <div key={avatar.id} className="avatar-card avatar-card-portrait">
                <div className="relative mb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-ponte-pink-400 to-ponte-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">{avatar.name}</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-primary-foreground text-xs px-2 py-1 rounded">
                    {avatar.rating}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{avatar.name}</h3>
                  <p className="text-sm text-foreground/60">{avatar.role}</p>
                  
                  <div className="flex items-center justify-between text-xs text-foreground/70">
                    <span>⭐ {avatar.rating}</span>
                    <span>📊 {avatar.bookings} bookings</span>
                  </div>
                  
                  <p className="text-sm font-medium text-primary">{avatar.price}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {avatar.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/request-talent?avatar=${avatar.id}`}
                    className="btn-primary-ponte w-full text-sm py-2 rounded-md font-medium mt-3"
                  >
                    Book Avatar
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/request-talent"
              className="btn-secondary-ponte text-base px-6 py-3 rounded-md font-medium"
            >
              View All 200+ Avatars
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for{" "}
              <span className="text-gradient">Talent & Brands</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Whether you&apos;re a creator looking to monetize your likeness or a brand seeking authentic endorsements, 
              PonteAI makes AI avatar licensing simple and secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">For Talent & Creators</h3>
              <p className="text-foreground/70 mb-6">
                License your voice, likeness, and personality to brands worldwide. 
                Maintain full control over usage rights while earning passive income.
              </p>
              <Link
                href="/onboard-client"
                className="btn-primary-ponte text-sm px-4 py-2 rounded-md font-medium"
              >
                Apply as Talent
              </Link>
            </div>

            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">For Brands & Agencies</h3>
              <p className="text-foreground/70 mb-6">
                Access premium celebrity and creator endorsements at scale. 
                Create compelling campaigns with ethical AI avatar technology.
              </p>
              <Link
                href="/request-talent"
                className="btn-primary-ponte text-sm px-4 py-2 rounded-md font-medium"
              >
                Start Booking Avatars
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
