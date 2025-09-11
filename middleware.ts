// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   // Якщо бекенд ставить cookie 'notehub.sid' (приклад), перевіряємо:
//   const hasSession = !!req.cookies.get("notehub_sid"); // заміни на реальне ім'я cookie
//   const pathname = req.nextUrl.pathname;

//   if (!hasSession && pathname.startsWith("/notes")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
//   return NextResponse.next();
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hasSession = !!req.cookies.get("notehub_sid"); // заміни на реальне ім’я cookie
  const { pathname } = req.nextUrl;

  // Захист приватних маршрутів
  if (!hasSession && pathname.startsWith("/notes")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  if (!hasSession && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Якщо користувач залогінений і йде на sign-in/sign-up → редірект на notes
  if (
    hasSession &&
    (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/notes", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
