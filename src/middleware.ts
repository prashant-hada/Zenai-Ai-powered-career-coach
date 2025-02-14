import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {NextResponse } from "next/server";
// import { getUserOnboardingStatus } from "./actions/user";

const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/resume(.*)',
  '/interview(.*)',
  '/cover-letter(.*)',
  '/onboarding(.*)'
])

// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();
//   const url = req.nextUrl;
//   let response = NextResponse.next();

//   // Set userId as HTTP-only cookie if present
//   if (userId) {
//     response.cookies.set('userId', userId, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 60 * 60, // 1hour
//     });

//     console.log("response.cookies: ",response.cookies)
//   }

//   // Redirect for root '/' route
//   if (url.pathname === '/') {
//     if (userId) {
//       response = NextResponse.redirect(new URL('/dashboard', req.url));
//     } else {
//       response = NextResponse.redirect(new URL('/landing', req.url));
//     }
//     // Copy cookies to the redirect response
//     response.cookies.set('userId', userId ?? '', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });
//     return response;
//   }

//   // Redirect to sign in if accessing protected routes without userId
//   if (!userId && protectedRoutes(req)) {
//     const { redirectToSignIn } = await auth();
//     return redirectToSignIn();
//   }

//   // Proceed with request if no other conditions match
//   return response;
// });


export default clerkMiddleware(async(auth, req )=>{
  const {userId} = await auth();
  const url = req.nextUrl;
  // const { isOnboarded } = await getUserOnboardingStatus();

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