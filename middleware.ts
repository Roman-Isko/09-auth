import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshSession } from "./lib/api/serverApi";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicPath =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePath =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const { data: newTokens } = await refreshSession();

      if (newTokens.accessToken && newTokens.refreshToken) {
        response.cookies.set("accessToken", newTokens.accessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        response.cookies.set("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
      }
    } catch {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }
  }

  if (!accessToken && isPrivatePath) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (accessToken && isPublicPath) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
