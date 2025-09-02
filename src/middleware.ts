import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/health",
    "/api/health",
    "/api/public/(.*)",
    "/api/webhooks/clerk",
  ],
  ignoredRoutes: [
    "/api/webhooks/clerk",
  ],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
