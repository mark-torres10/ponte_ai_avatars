import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes and their required roles
const protectedRoutes = {
  '/talent': ['talent', 'admin'],
  '/client': ['client', 'admin'],
  '/admin': ['admin'],
  '/onboard-talent': ['talent'],
  '/onboard-client': ['client'],
};

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/sign-up',
  '/generate-avatar',
  '/request-talent',
  '/api/auth/signout',
];

// Define onboarding routes
const onboardingRoutes = [
  '/role-selection',
  '/onboard-talent',
  '/onboard-client',
];

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to login
  if (!userId) {
    const signInUrl = new URL('/login', req.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // For onboarding routes, allow access
  if (onboardingRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, check user role
  if (Object.keys(protectedRoutes).includes(pathname)) {
    try {
      // Fetch user role from API
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userId}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const userRole = userData.data?.role;

        if (userRole) {
          // Check if user has access to this route
          const requiredRoles = protectedRoutes[pathname as keyof typeof protectedRoutes];
          if (requiredRoles && requiredRoles.includes(userRole)) {
            return NextResponse.next();
          } else {
            // User doesn't have access, redirect to their dashboard
            const dashboardUrl = new URL(`/${userRole}`, req.url);
            return NextResponse.redirect(dashboardUrl);
          }
        } else {
          // User has no role assigned, redirect to role selection
          const roleSelectionUrl = new URL('/role-selection', req.url);
          return NextResponse.redirect(roleSelectionUrl);
        }
      } else {
        // User doesn't exist in database, redirect to role selection
        const roleSelectionUrl = new URL('/role-selection', req.url);
        return NextResponse.redirect(roleSelectionUrl);
      }
    } catch (error) {
      console.error('Middleware error:', error);
      // On error, redirect to role selection
      const roleSelectionUrl = new URL('/role-selection', req.url);
      return NextResponse.redirect(roleSelectionUrl);
    }
  }

  // For any other route, allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}; 