// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { refreshSession } from "./lib/api/serverApi";

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;
//   const refreshToken = cookieStore.get("refreshToken")?.value;

//   const isPublicPath =
//     pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
//   const isPrivatePath =
//     pathname.startsWith("/profile") || pathname.startsWith("/notes");

//   const response = NextResponse.next();

//   if (!accessToken && refreshToken) {
//     try {
//       const { data: newTokens } = await refreshSession();

//       if (newTokens.accessToken && newTokens.refreshToken) {
//         response.cookies.set("accessToken", newTokens.accessToken, {
//           httpOnly: true,
//           sameSite: "lax",
//           secure: process.env.NODE_ENV === "production",
//           path: "/",
//         });
//         response.cookies.set("refreshToken", newTokens.refreshToken, {
//           httpOnly: true,
//           sameSite: "lax",
//           secure: process.env.NODE_ENV === "production",
//           path: "/",
//         });
//       }
//     } catch {
//       response.cookies.delete("accessToken");
//       response.cookies.delete("refreshToken");
//     }
//   }

//   if (!accessToken && isPrivatePath) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/sign-in";
//     return NextResponse.redirect(url);
//   }

//   if (accessToken && isPublicPath) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
// };

/////////////////////////////////////////////////////////////////

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshSession } from "./lib/api/serverApi";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicPath =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePath =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  // --- отримуємо токени синхронно ---
  const accessToken = req.cookies.get("accessToken")?.value ?? null;
  const refreshToken = req.cookies.get("refreshToken")?.value ?? null;

  let token = accessToken;

  console.log("middleware tokens:", { accessToken, refreshToken, pathname });

  // --- оновлення токенів через refreshToken ---
  if (!accessToken && refreshToken) {
    try {
      const newTokens = await refreshSession();

      if (newTokens?.accessToken && newTokens?.refreshToken) {
        token = newTokens.accessToken;
        const res = NextResponse.next();
        res.cookies.set("accessToken", newTokens.accessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        res.cookies.set("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        return res;
      } else {
        const url = req.nextUrl.clone();
        url.pathname = "/sign-in";
        const res = NextResponse.redirect(url);
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
      }
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      const res = NextResponse.redirect(url);
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  // --- редірект на /sign-in для приватних маршрутів без токена ---
  if (!token && isPrivatePath) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // --- редірект на /profile для публічних маршрутів, якщо користувач залогінений ---
  if (token && isPublicPath) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};

////////////////////////////////////////////////////////////////

// middleware.ts
// import { NextRequest, NextResponse } from "next/server";
// import { refreshSession } from "./lib/api/serverApi"; // 👈 імпортуємо дефолтний export

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const isPublicPath =
//     pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
//   const isPrivatePath =
//     pathname.startsWith("/profile") || pathname.startsWith("/notes");

//   const accessToken = req.cookies.get("accessToken")?.value ?? null;
//   const refreshToken = req.cookies.get("refreshToken")?.value ?? null;

//   let token = accessToken;

//   console.log(
//     "token in middleware:",
//     token,
//     "refreshToken:",
//     refreshToken,
//     "pathname:",
//     pathname,
//   );

//   // --- Оновлення токенів через refreshToken ---
//   if (!accessToken && refreshToken) {
//     try {
//       const { data: newTokens } = await refreshSession(); // 👈 тепер повертає одразу токени
//       if (newTokens?.accessToken && newTokens?.refreshToken) {
//         token = newTokens.accessToken;

//         const res = NextResponse.next();
//         res.cookies.set("accessToken", newTokens.accessToken, {
//           httpOnly: true,
//           sameSite: "lax",
//           secure: process.env.NODE_ENV === "production",
//           path: "/",
//         });
//         res.cookies.set("refreshToken", newTokens.refreshToken, {
//           httpOnly: true,
//           sameSite: "lax",
//           secure: process.env.NODE_ENV === "production",
//           path: "/",
//         });
//         return res;
//       } else {
//         // refreshSession не повернув токени → видаляємо і редиректимо на sign-in
//         const url = req.nextUrl.clone();
//         url.pathname = "/sign-in";
//         const res = NextResponse.redirect(url);
//         res.cookies.delete("accessToken");
//         res.cookies.delete("refreshToken");
//         return res;
//       }
//     } catch {
//       const url = req.nextUrl.clone();
//       url.pathname = "/sign-in";
//       const res = NextResponse.redirect(url);
//       res.cookies.delete("accessToken");
//       res.cookies.delete("refreshToken");
//       return res;
//     }
//   }

//   // --- Редірект на /sign-in для приватних маршрутів без токена ---
//   if (!token && isPrivatePath) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/sign-in";
//     return NextResponse.redirect(url);
//   }

//   // --- Редірект на /profile для публічних маршрутів, якщо користувач залогінений ---
//   if (token && isPublicPath) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/profile";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
// };
