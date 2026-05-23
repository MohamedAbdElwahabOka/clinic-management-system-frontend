// import createMiddleware from 'next-intl/middleware';
// import {routing} from './i18n/routing';

// export default createMiddleware(routing);

// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(ar|en|de)/:path*']
// };

// src/middleware.ts
import { auth } from "@/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);
const publicPages = ["/login", "/signup", "/", "/terms", "/privacy"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  let pathWithoutLocale = nextUrl.pathname.replace(/^\/(ar|en|de)/, "");
  if (pathWithoutLocale === "") pathWithoutLocale = "/";

  const isPublicPage = publicPages.includes(pathWithoutLocale);
  const isAuthPage = pathWithoutLocale === "/login";

  // 1. Protect pages (redirect to login if not logged in and page is not public)
  if (!isPublicPage && !isLoggedIn) {
    const locale = nextUrl.pathname.split("/")[1] || "en";
    return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl));
  }

  // 2. Role-Based Access Control (RBAC)
  if (isLoggedIn) {
    const locale = nextUrl.pathname.split("/")[1] || "en";

    // Define route patterns
    const isReceptionRoute = pathWithoutLocale.startsWith("/reception");
    const isDoctorRoute = pathWithoutLocale.startsWith("/dashboard"); // Assuming 'dashboard' is for doctors/admins

    // Logic for Receptionist (ASSISTANT)
    if (userRole === "ASSISTANT" || userRole === "reception") {
      // Prevent access to doctor routes
      if (isDoctorRoute) {
        return NextResponse.redirect(new URL(`/${locale}/reception/appointments`, nextUrl));
      }
    }
    // Logic for Doctor (or other roles)
    else if (userRole === "DOCTOR") {
      // Prevent access to reception routes
      if (isReceptionRoute) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, nextUrl));
      }
    }
  }

  // 3. Smart Redirect on Login Page (if already logged in)
  if (isAuthPage && isLoggedIn) {
    const locale = nextUrl.pathname.split("/")[1] || "en";

    if (userRole === "ASSISTANT" || userRole === "reception") {
      return NextResponse.redirect(
        new URL(`/${locale}/reception/appointments`, nextUrl)
      );
    }
    // Default to dashboard for everyone else (Doctors, Admins)
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/",
    "/(ar|en|de)/:path*",
  ],
};
