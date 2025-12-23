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
const publicPages = ['/login', '/signup','/']; 

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  // هنا بنجيب الرول من التوكن اللي جوه الريكويست
  const userRole = req.auth?.user?.role; 

  let pathWithoutLocale = nextUrl.pathname.replace(/^\/(ar|en|de)/, '');
  if (pathWithoutLocale === '') pathWithoutLocale = '/';

  const isPublicPage = publicPages.includes(pathWithoutLocale);
  const isAuthPage = pathWithoutLocale === '/login' || pathWithoutLocale === '/signup';

  // 1. حماية الصفحات (زي ما هي)
  if (!isPublicPage && !isLoggedIn) {
    const locale = nextUrl.pathname.split('/')[1] || 'en';
    return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl));
  }

  // 2. التوجيه الذكي بعد تسجيل الدخول (الجديد هنا)
  if (isAuthPage && isLoggedIn) {
    const locale = nextUrl.pathname.split('/')[1] || 'en';
    
    // لو الرول "reception" وديه على المواعيد
    if (userRole === 'reception') {
        return NextResponse.redirect(new URL(`/${locale}/reception/appointments`, nextUrl));
    }
    
    // أي حد تاني (admin مثلاً) وديه الداشبورد
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    '/',
    '/(ar|en|de)/:path*'
  ],
};