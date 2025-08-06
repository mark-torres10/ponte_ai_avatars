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
  '/api/users',
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
  
  // Allow API routes that start with /api/users (for role checking)
  if (pathname.startsWith('/api/users/')) {
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
    console.log('🔍 Middleware: Checking protected route:', pathname);
    console.log('🔍 Middleware: User ID:', userId);
    
    try {
      // Fetch user role from API
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const apiUrl = `${baseUrl}/api/users/${userId}`;
      console.log('🔍 Middleware: Making API call to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        // No Authorization header needed - Clerk handles authentication in middleware context
      });

      console.log('🔍 Middleware: API Response status:', response.status);
      console.log('🔍 Middleware: API Response ok:', response.ok);

      if (response.ok) {
        const userData = await response.json();
        console.log('🔍 Middleware: User data received:', userData);
        const userRole = userData.data?.role;
        console.log('🔍 Middleware: User role:', userRole);

        if (userRole) {
          // Check if user has access to this route
          const requiredRoles = protectedRoutes[pathname as keyof typeof protectedRoutes];
          console.log('🔍 Middleware: Required roles for', pathname, ':', requiredRoles);
          console.log('🔍 Middleware: User role', userRole, 'in required roles:', requiredRoles?.includes(userRole));
          
          if (requiredRoles && requiredRoles.includes(userRole)) {
            console.log('🔍 Middleware: ✅ User has access, allowing route');
            return NextResponse.next();
          } else {
            // User doesn't have access, redirect to their dashboard
            console.log('🔍 Middleware: ❌ User lacks access, redirecting to dashboard:', `/${userRole}`);
            const dashboardUrl = new URL(`/${userRole}`, req.url);
            return NextResponse.redirect(dashboardUrl);
          }
        } else {
          // User has no role assigned, redirect to role selection
          console.log('🔍 Middleware: ❌ User has no role assigned, redirecting to role selection');
          const roleSelectionUrl = new URL('/role-selection', req.url);
          return NextResponse.redirect(roleSelectionUrl);
        }
      } else {
        // User doesn't exist in database, redirect to role selection
        console.log('🔍 Middleware: ❌ User not found in database, redirecting to role selection');
        const roleSelectionUrl = new URL('/role-selection', req.url);
        return NextResponse.redirect(roleSelectionUrl);
      }
    } catch (error) {
      console.error('🔍 Middleware: Error checking user role:', error);
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