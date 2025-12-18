// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/profile", "/notes"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = PUBLIC_ROUTES.includes(pathname);
  const isPrivateRoute = PRIVATE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  let response: NextResponse | null = null;

  // Якщо немає accessToken, але є refreshToken — пробуємо перевірити/оновити сесію
  if (!isAuthenticated && refreshToken) {
    const cookieHeader = request.headers.get("cookie") ?? "";

    try {
      const session = await checkSession(cookieHeader);

      if (session.ok && session.data) {
        isAuthenticated = true;

        const setCookie = session.headers["set-cookie"];
        if (setCookie) {
          response = NextResponse.next();
          // додаємо set-cookie, якщо бек оновив токени
          response.headers.append("set-cookie", setCookie);
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Приватні маршрути доступні тільки авторизованим
  if (isPrivateRoute && !isAuthenticated) {
    const url = new URL("/sign-in", request.url);
    return NextResponse.redirect(url);
  }

  // Якщо вже авторизований — не пускаємо на сторінки логіну/реєстрації
  if (isAuthRoute && isAuthenticated) {
    const url = new URL("/profile", request.url);
    return NextResponse.redirect(url);
  }

  return response ?? NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
