import { SignIn } from "@clerk/nextjs";
import { ClerkWrapper } from "@/components/ClerkWrapper";

export default function LoginPage() {
  return (
    <ClerkWrapper>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Ponte AI
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your AI avatar marketplace
            </p>
          </div>
          
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-card border border-border shadow-lg",
                headerTitle: "text-2xl font-bold text-foreground",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                formFieldInput: "bg-background border border-input text-foreground",
                formFieldLabel: "text-foreground",
                footerActionLink: "text-primary hover:text-primary/90",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground",
                socialButtonsBlockButton: "bg-background border border-input text-foreground hover:bg-accent",
                socialButtonsBlockButtonText: "text-foreground",
              },
            }}
            redirectUrl="/role-selection"
          />
        </div>
      </div>
    </ClerkWrapper>
  );
} 