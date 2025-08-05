import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/login",
    "/sign-up", 
    "/auth-test",
    "/api/webhooks(.*)",
    "/_next(.*)",
    "/favicon.ico",
    "/api/health"
  ],
  
  // Routes that can be accessed by both authenticated and unauthenticated users
  ignoredRoutes: [
    "/api/webhooks(.*)",
    "/_next(.*)",
    "/favicon.ico"
  ],
  
  // Redirect unauthenticated users to login
  afterAuth(auth, req) {
    // Handle unauthenticated users
    if (!auth.userId && !auth.isPublicRoute) {
      const loginUrl = new URL('/login', req.url);
      return Response.redirect(loginUrl);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}; 