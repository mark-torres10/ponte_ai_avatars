'use client'

import Link from "next/link"
import { useClerkUser } from "@/lib/useClerkUser"
import { useRoleRedirect } from "@/lib/useUserRole"

export default function LandingPageHeader() {
  const { user } = useClerkUser()
  const { getDashboardUrl } = useRoleRedirect()

  return (
    <div className="border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-primary">
              Ponte AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                href={getDashboardUrl()}
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="btn-primary-ponte text-sm px-4 py-2 rounded-md font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
