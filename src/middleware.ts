import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/login(.*)",
    "/sign-up", 
    "/auth-test",
    "/api/webhooks(.*)",
    "/_next(.*)",
    "/favicon.ico",
    "/api/health"
  ],
  ignoredRoutes: [
    "/_next(.*)",
    "/favicon.ico",
    "/api/health"
  ]
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}; 