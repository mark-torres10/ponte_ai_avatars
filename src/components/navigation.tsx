"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const Navigation = () => {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/request-talent", label: "Request Talent" },
    { href: "/onboard-client", label: "Onboard Talent" },
    { href: "/generate-avatar", label: "Generate Avatar" },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-ponte rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-gradient">Ponte AI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link text-sm font-medium transition-colors duration-200",
                  pathname === item.href && "nav-link-active"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/request-talent"
              className="btn-secondary-ponte text-sm px-4 py-2 rounded-md font-medium"
            >
              Book Avatar
            </Link>
            <Link
              href="/onboard-client"
              className="btn-primary-ponte text-sm px-4 py-2 rounded-md font-medium"
            >
              Join as Talent
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 