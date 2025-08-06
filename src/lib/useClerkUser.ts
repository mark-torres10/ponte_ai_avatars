import { useUser } from '@clerk/nextjs'

export function useClerkUser() {
  // Check if Clerk is configured
  const hasClerkConfig = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  // Only use Clerk hooks if Clerk is configured
  if (hasClerkConfig) {
    return useUser()
  }
  
  // Return safe defaults when Clerk is not configured (CI environment)
  return {
    user: null,
    isLoaded: true,
    isSignedIn: false,
    isSignUp: false,
    isSignIn: false,
    signOut: () => Promise.resolve(),
    signOutUrl: '',
    signInUrl: '',
    signUpUrl: '',
    afterSignInUrl: '',
    afterSignUpUrl: '',
    afterSignOutUrl: '',
    afterSignInOneFactorUrl: '',
    afterSignUpOneFactorUrl: '',
    afterSignInTwoFactorUrl: '',
    afterSignUpTwoFactorUrl: '',
    afterSignOutOneFactorUrl: '',
    afterSignOutTwoFactorUrl: '',
  }
} 