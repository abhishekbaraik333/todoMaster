import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes
const isPublicRoutes = createRouteMatcher(['/sign-in', '/sign-up', "/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // 1. Already authenticated, visiting sign-in or sign-up:
  if (userId && isPublicRoutes(req) && req.nextUrl.pathname !== '/api/sign-up') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Unauthenticated, visiting dashboard, redirect to sign-in:
  if (req.nextUrl.pathname.startsWith('/dashboard') && !userId) {
    return redirectToSignIn();
  }

  // 3. For any other route not listed as public, protect it as usual:
  if (!isPublicRoutes(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
