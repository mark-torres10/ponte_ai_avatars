'use client'

import { useUserRole } from '@/lib/useUserRole'
import Link from 'next/link'

export default function RoleBasedNavigation() {
  const { role, isLoading, error } = useUserRole()

  if (isLoading) {
    return (
      <nav className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-300 h-4 w-20 rounded"></div>
        <div className="animate-pulse bg-gray-300 h-4 w-16 rounded"></div>
        <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
      </nav>
    )
  }

  if (error) {
    return (
      <nav className="flex items-center space-x-4">
        <span className="text-red-500 text-sm">Error loading navigation</span>
      </nav>
    )
  }

  // Navigation items based on role
  const getNavigationItems = () => {
    switch (role) {
      case 'talent':
        return [
          { href: '/talent', label: 'Dashboard' },
          { href: '/talent/profile', label: 'Profile' },
          { href: '/talent/bookings', label: 'Bookings' },
          { href: '/talent/earnings', label: 'Earnings' },
        ]
      case 'client':
        return [
          { href: '/client', label: 'Dashboard' },
          { href: '/request-talent', label: 'Browse Avatars' },
          { href: '/client/campaigns', label: 'Campaigns' },
          { href: '/client/bookings', label: 'My Bookings' },
        ]
      case 'admin':
        return [
          { href: '/admin', label: 'Dashboard' },
          { href: '/admin/users', label: 'Users' },
          { href: '/admin/analytics', label: 'Analytics' },
          { href: '/admin/support', label: 'Support' },
        ]
      default:
        return [
          { href: '/role-selection', label: 'Choose Role' },
        ]
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className="flex items-center space-x-4">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
} 