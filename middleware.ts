import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  const isPublicPath =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePath =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  if (!accessToken && isPrivatePath) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (accessToken && isPublicPath) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
