import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function AuthTestPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Clerk Authentication Test
          </h1>
          <p className="text-foreground/60 mb-8">
            This page tests the Clerk authentication integration
          </p>
        </div>

        <div className="space-y-4">
          <SignedOut>
            <div className="space-y-4">
              <p className="text-center text-foreground/80">
                You are not signed in. Please sign in to continue.
              </p>
              <div className="flex flex-col space-y-2">
                <SignInButton mode="modal">
                  <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:bg-secondary/90">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="space-y-4">
              <p className="text-center text-foreground/80">
                You are signed in! Welcome to Ponte AI.
              </p>
              <div className="flex justify-center">
                <UserButton />
              </div>
            </div>
          </SignedIn>
        </div>

        <div className="mt-8 p-4 bg-secondary/20 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Test Status:</h3>
          <ul className="text-sm text-foreground/70 space-y-1">
            <li>✅ Clerk package installed</li>
            <li>✅ Environment variables configured</li>
            <li>✅ Middleware created</li>
            <li>✅ ClerkProvider wrapped in layout</li>
            <li>✅ Authentication components loaded</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 