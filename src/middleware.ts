import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { normalizeBackendUrl } from "@/lib/utils";

// Define protected routes and their required roles
const protectedRoutes = {
  '/talent': ['talent', 'admin'],
  '/client': ['client', 'admin'],
  '/admin': ['admin'],
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
];

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  logger.info('Middleware: Processing request', { pathname, userId });

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    logger.info('Middleware: Allowing public route', { pathname });
    return NextResponse.next();
  }
  
  // Allow API routes that start with /api/users (for role checking)
  if (pathname.startsWith('/api/users/')) {
    logger.info('Middleware: Allowing API route', { pathname });
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to login
  if (!userId) {
    logger.warn('Middleware: User not authenticated, redirecting to login', { pathname });
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
    logger.info('Middleware: Checking protected route', { pathname, userId });
    
    try {
      // Fetch user role from backend API with retry logic
      const backendUrl = normalizeBackendUrl(process.env.BACKEND_URL || 'http://localhost:3001');
      const apiUrl = `${backendUrl}/api/users/${userId}`;
      logger.debug('Middleware: Making backend API call', { apiUrl });
      
      let response;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          response = await fetch(apiUrl, {
            // No Authorization header needed - Clerk handles authentication in middleware context
          });
          
          logger.debug('Middleware: API Response received', { status: response.status, ok: response.ok });
          
          if (response.ok) {
            break; // Success, exit retry loop
          }
          
          if (response.status === 404 && retryCount < maxRetries) {
            // User might not exist yet, wait a bit and retry
            logger.debug('Middleware: User not found, retrying', { retryCount });
            await new Promise(resolve => setTimeout(resolve, 500));
            retryCount++;
            continue;
          }
          
          break; // Exit retry loop for other errors
        } catch (fetchError) {
          logger.error('Middleware: Fetch error', { error: fetchError });
          if (retryCount < maxRetries) {
            logger.debug('Middleware: Fetch failed, retrying', { retryCount });
            await new Promise(resolve => setTimeout(resolve, 500));
            retryCount++;
            continue;
          }
          throw fetchError;
        }
      }

      if (response && response.ok) {
        const userData = await response.json();
        logger.debug('Middleware: User data received', { userData });
        const userRole = userData.data?.role;
        logger.info('Middleware: User role retrieved', { userRole });

        if (userRole) {
          // Check if user has access to this route
          const requiredRoles = protectedRoutes[pathname as keyof typeof protectedRoutes];
          logger.debug('Middleware: Checking route access', { pathname, userRole, requiredRoles });
          
          if (requiredRoles && requiredRoles.includes(userRole)) {
            logger.info('Middleware: User has access, allowing route', { pathname, userRole });
            return NextResponse.next();
          } else {
            // User doesn't have access, redirect to their dashboard
            logger.warn('Middleware: User lacks access, redirecting to dashboard', { pathname, userRole });
            const dashboardUrl = new URL(`/${userRole}`, req.url);
            return NextResponse.redirect(dashboardUrl);
          }
        } else {
          // User has no role assigned, redirect to role selection
          logger.warn('Middleware: User has no role assigned, redirecting to role selection');
          const roleSelectionUrl = new URL('/role-selection', req.url);
          return NextResponse.redirect(roleSelectionUrl);
        }
      } else {
        // User doesn't exist in database or API failed
        // Redirect to role selection instead of allowing the route
        logger.info('Middleware: User not found in database, redirecting to role selection');
        const roleSelectionUrl = new URL('/role-selection', req.url);
        return NextResponse.redirect(roleSelectionUrl);
      }
    } catch (error) {
      logger.error('Middleware: Error checking user role', { error });
      // On error, deny access for security - redirect to login
      logger.warn('Middleware: Error occurred, denying access for security');
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
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