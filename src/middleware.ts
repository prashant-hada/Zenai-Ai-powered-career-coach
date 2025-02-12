import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {NextResponse } from "next/server";

const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/resume(.*)',
  '/interview(.*)',
  '/cover-letter(.*)',
  '/onboarding(.*)'
])
export default clerkMiddleware(async(auth, req )=>{
  const {userId} = await auth();
  const url = req.nextUrl;

  // Redirect for the root route '/'
  if (url.pathname === '/') {
    // If not logged in, redirect to /landing
    if (!userId) {
      return NextResponse.redirect(new URL('/landing', req.url));
    }
    // If logged in, redirect to /dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if(!userId && protectedRoutes(req)){
    const {redirectToSignIn} = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};