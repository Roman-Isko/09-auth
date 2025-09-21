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

// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Отримуємо токени з кукі
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPublicPath =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname === "/" ||
    pathname.startsWith("/api");

  const isPrivatePath =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  // Якщо немає accessToken, але є refreshToken, пробуємо оновити сесію
  if (!accessToken && refreshToken) {
    try {
      const apiRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        cache: "no-store",
      });

      if (!apiRes.ok) {
        // refresh не пройшов — видаляємо кукі
        const response = NextResponse.next();
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        if (isPrivatePath) {
          const url = req.nextUrl.clone();
          url.pathname = "/sign-in";
          return NextResponse.redirect(url);
        }
        return response;
      }
      // Сервер має сам встановити Set-Cookie
    } catch (err) {
      console.error("Failed fetching /users/me:", err);
      const response = NextResponse.next();
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      if (isPrivatePath) {
        const url = req.nextUrl.clone();
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
      }
      return response;
    }
  }

  // Редирект неавторизованих на приватні сторінки
  if (!accessToken && isPrivatePath) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Редирект авторизованих на публічні сторінки (sign-in/sign-up)
  if (accessToken && isPublicPath && pathname !== "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// matcher для middleware
export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};

// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study";

// type TokensCandidate = { accessToken?: string; refreshToken?: string };

// function isTokensCandidate(obj: unknown): obj is TokensCandidate {
//   return (
//     typeof obj === "object" &&
//     obj !== null &&
//     ("accessToken" in (obj as object) || "refreshToken" in (obj as object))
//   );
// }

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Read cookies from Edge request
//   const accessToken = req.cookies.get("accessToken")?.value;
//   const refreshToken = req.cookies.get("refreshToken")?.value;

//   const isPublicPath =
//     pathname.startsWith("/sign-in") ||
//     pathname.startsWith("/sign-up") ||
//     pathname === "/" ||
//     pathname.startsWith("/api");
//   const isPrivatePath =
//     pathname.startsWith("/profile") || pathname.startsWith("/notes");

//   const response = NextResponse.next();
//   let isAuthenticated = Boolean(accessToken);

//   if (!isAuthenticated && refreshToken) {
//     try {
//       const cookieHeader = `refreshToken=${refreshToken}`;
//       const apiRes = await fetch(`${API_URL}/auth/refresh`, {
//         method: "POST",
//         headers: {
//           Cookie: cookieHeader,
//         },
//         cache: "no-store",
//       });

//       if (apiRes.ok) {
//         // parse JSON safely
//         let parsed: unknown = null;
//         try {
//           parsed = await apiRes.json();
//         } catch {
//           parsed = null;
//         }

//         if (isTokensCandidate(parsed)) {
//           if (parsed.accessToken) {
//             response.cookies.set("accessToken", parsed.accessToken, {
//               httpOnly: true,
//               sameSite: "none",
//               secure: process.env.NODE_ENV === "production",
//               path: "/",
//             });
//           }
//           if (parsed.refreshToken) {
//             response.cookies.set("refreshToken", parsed.refreshToken, {
//               httpOnly: true,
//               sameSite: "none",
//               secure: process.env.NODE_ENV === "production",
//               path: "/",
//             });
//           }
//           isAuthenticated = Boolean(parsed.accessToken || parsed.refreshToken);
//         } else {
//           // fallback: backend may set cookies via Set-Cookie header
//           const setCookieHeader = apiRes.headers.get("set-cookie");
//           if (setCookieHeader) {
//             const parts = setCookieHeader.split(/,(?=\s*[^=]+=)/);
//             for (const p of parts) {
//               const nameValue = p.split(";")[0];
//               const idx = nameValue.indexOf("=");
//               if (idx > -1) {
//                 const name = nameValue.slice(0, idx).trim();
//                 const value = nameValue.slice(idx + 1).trim();
//                 if (name && value) {
//                   response.cookies.set(name, value, {
//                     httpOnly: true,
//                     sameSite: "none",
//                     secure: process.env.NODE_ENV === "production",
//                     path: "/",
//                   });
//                   if (name === "accessToken") isAuthenticated = true;
//                 }
//               }
//             }
//           }
//         }
//       } else {
//         response.cookies.delete("accessToken");
//         response.cookies.delete("refreshToken");
//       }
//     } catch {
//       response.cookies.delete("accessToken");
//       response.cookies.delete("refreshToken");
//     }
//   }

//   if (!isAuthenticated && isPrivatePath) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/sign-in";
//     console.log("accessToken:", accessToken, "refreshToken:", refreshToken);

//     return NextResponse.redirect(url);
//   }

//   if (isAuthenticated && isPublicPath && pathname !== "/") {
//     const url = req.nextUrl.clone();
//     url.pathname = "/";
//     console.log("accessToken:", accessToken, "refreshToken:", refreshToken);

//     return NextResponse.redirect(url);
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
// };
