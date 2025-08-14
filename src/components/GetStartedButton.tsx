'use client'

import Link from "next/link"
import { useClerkUser } from "@/lib/useClerkUser"
import { useRoleRedirect } from "@/lib/useUserRole"

export default function GetStartedButton() {
  const { user } = useClerkUser()
  const { getDashboardUrl } = useRoleRedirect()

  if (user) {
    // Authenticated user - redirect to appropriate dashboard
    return (
      <Link
        href={getDashboardUrl()}
        className="btn-primary-ponte text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium w-full sm:w-auto"
      >
        Get Started
      </Link>
    )
  }

  // Unauthenticated user - redirect to login
  return (
    <Link
      href="/login"
      className="btn-primary-ponte text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-md font-medium w-full sm:w-auto"
    >
      Get Started
    </Link>
  )
}
