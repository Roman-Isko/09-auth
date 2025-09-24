// import axios, { AxiosInstance, AxiosResponse } from "axios";
// import { cookies } from "next/headers";
// import type { ServerUser } from "./types";
// import type { User } from "../../types/user";
// import type { Note, NotesResponse } from "../../types/note";

// const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

// const serverApi: AxiosInstance = axios.create({
//   baseURL: apiUrl,
//   withCredentials: true,
// });

// type CookieEntry = { name: string; value: string };
// type CookieStoreLike = {
//   getAll: () => CookieEntry[];
//   get?: (name: string) => CookieEntry | undefined;
//   toString?: () => string;
// };

// async function resolveCookieStore(): Promise<CookieStoreLike> {
//   const maybe = cookies() as unknown;
//   if (typeof (maybe as Promise<unknown>)?.then === "function") {
//     return await (maybe as Promise<CookieStoreLike>);
//   }
//   return maybe as CookieStoreLike;
// }

// function cookieHeaderFromStore(store: CookieStoreLike): string {
//   return store
//     .getAll()
//     .map((c) => `${c.name}=${c.value}`)
//     .join("; ");
// }

// export type TokensResponse = {
//   accessToken: string;
//   refreshToken: string;
// };

// export async function signIn(payload: {
//   email: string;
//   password: string;
// }): Promise<ServerUser> {
//   const res = await serverApi.post<ServerUser>("/auth/login", payload, {
//     headers: { "Content-Type": "application/json" },
//   });
//   return res.data;
// }

// export async function signUp(payload: {
//   email: string;
//   password: string;
// }): Promise<ServerUser> {
//   const res = await serverApi.post<ServerUser>("/auth/register", payload, {
//     headers: { "Content-Type": "application/json" },
//   });
//   return res.data;
// }

// export async function refreshSession(): Promise<AxiosResponse<TokensResponse>> {
//   const cookieStore = await resolveCookieStore();
//   const cookieHeader = cookieHeaderFromStore(cookieStore);

//   return serverApi.get<TokensResponse>("/auth/refresh", {
//     headers: { Cookie: cookieHeader },
//   });
// }

// export async function getUserServer(): Promise<User | null> {
//   const cookieStore = await resolveCookieStore();
//   const cookieHeader = cookieHeaderFromStore(cookieStore);

//   try {
//     const res = await serverApi.get<ServerUser>("/users/me", {
//       headers: { Cookie: cookieHeader },
//     });

//     const serverUser = res.data;

//     return {
//       id: serverUser.id,
//       email: serverUser.email,
//       username: serverUser.name ?? "Unknown",
//       avatar: serverUser.avatar ?? "",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//   } catch {
//     return null;
//   }
// }

// export async function getNoteById(noteId: string): Promise<Note> {
//   const cookieStore = await resolveCookieStore();
//   const cookieHeader = cookieHeaderFromStore(cookieStore);

//   const res = await serverApi.get<Note>(`/notes/${noteId}`, {
//     headers: { Cookie: cookieHeader },
//   });
//   return res.data;
// }

// export async function getNotesServer(params: {
//   page: number;
//   search?: string;
//   tag?: string;
// }): Promise<NotesResponse> {
//   const cookieStore = await resolveCookieStore();
//   const cookieHeader = cookieHeaderFromStore(cookieStore);

//   const { page, search, tag } = params;

//   const queryParams: Record<string, unknown> = { page, perPage: 12 };
//   if (search) queryParams.search = search;
//   if (tag) queryParams.tag = tag;

//   const res = await serverApi.get<NotesResponse>("/notes", {
//     headers: { Cookie: cookieHeader },
//     params: queryParams,
//   });

//   return res.data;
// }

// export default serverApi;

//////////////////////////////////////////////////////////////////

// lib/api/serverApi.ts
// lib/api/serverApi.ts
import type { User } from "../../types/user";

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study") +
  "/api";

export type TokensResponse = {
  accessToken?: string;
  refreshToken?: string;
};

// --- оновлення сесії через refreshToken ---
export async function refreshSession(): Promise<TokensResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return {};
    return (await res.json()) as TokensResponse;
  } catch {
    return {};
  }
}

// --- отримати поточного користувача з серверних cookies ---
export async function getUserServer(
  cookieHeader?: string,
): Promise<User | null> {
  try {
    const headers: HeadersInit = {};
    if (cookieHeader) headers["Cookie"] = cookieHeader;

    const res = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const serverUser = (await res.json().catch(() => ({}))) as Partial<User> & {
      _id?: string;
      name?: string;
    };

    return {
      id: serverUser.id ?? serverUser._id ?? "",
      email: serverUser.email ?? "",
      username: serverUser.username ?? serverUser.name ?? "",
      avatar: serverUser.avatar ?? "",
      createdAt: serverUser.createdAt ?? new Date().toISOString(),
      updatedAt: serverUser.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

//////////////////////////////////////////////////////////////////

// lib/api/serverApi.ts
// import type { User } from "../../types/user";
// import type { Note, NotesResponse } from "../../types/note";

// const API_URL =
//   (process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study") +
//   "/api";

// export type TokensResponse = {
//   accessToken?: string;
//   refreshToken?: string;
// };

// // --- refreshSession для middleware ---
// export async function refreshSession(): Promise<TokensResponse> {
//   try {
//     const res = await fetch(`${API_URL}/auth/refresh`, {
//       method: "POST",
//       credentials: "include", // cookies будуть відправлятися автоматично
//       cache: "no-store",
//     });

//     if (!res.ok) return {}; // якщо помилка, повертаємо порожній об'єкт

//     const tokens: Partial<TokensResponse> = (await res
//       .json()
//       .catch(() => ({}))) as Partial<TokensResponse>;

//     // Дебаг
//     console.log("refreshSession tokens:", tokens);

//     return {
//       accessToken: tokens.accessToken,
//       refreshToken: tokens.refreshToken,
//     };
//   } catch (err) {
//     console.error("refreshSession error:", err);
//     return {};
//   }
// }

// // --- Отримати поточного користувача ---
// export async function getUserServer(
//   cookieHeader?: string,
// ): Promise<User | null> {
//   try {
//     console.log("Fetching user with cookies:", cookieHeader);
//     // if (cookieHeader) console.log("Fetching user with cookies:", cookieHeader);

//     const res = await fetch(`${API_URL}/users/me`, {
//       method: "GET",
//       headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
//       cache: "no-store",
//     });

//     if (!res.ok) return null;

//     type ServerUser = {
//       id?: string;
//       _id?: string;
//       email?: string;
//       name?: string;
//       username?: string;
//       avatar?: string;
//       createdAt?: string;
//       updatedAt?: string;
//     };

//     const serverUser: ServerUser = (await res
//       .json()
//       .catch(() => ({}))) as ServerUser;

//     const user: User = {
//       id: serverUser.id ?? serverUser._id ?? "",
//       email: serverUser.email ?? "",
//       username: serverUser.name ?? serverUser.username ?? "",
//       avatar: serverUser.avatar ?? "",
//       createdAt: serverUser.createdAt ?? new Date().toISOString(),
//       updatedAt: serverUser.updatedAt ?? new Date().toISOString(),
//     };

//     return user;
//   } catch (err) {
//     console.error("getUserServer error:", err);
//     return null;
//   }
// }

// // --- Отримати нотатки ---
// export async function getNotesServer(params: {
//   page: number;
//   perPage?: number;
//   search?: string;
//   tag?: string;
// }): Promise<NotesResponse> {
//   const url = new URL(`${API_URL}/notes`);
//   url.searchParams.set("page", String(params.page));
//   url.searchParams.set("perPage", String(params.perPage ?? 12));
//   if (params.search) url.searchParams.set("search", params.search);
//   if (params.tag) url.searchParams.set("tag", params.tag);

//   const res = await fetch(url.toString(), { method: "GET", cache: "no-store" });
//   if (!res.ok) throw new Error(`Failed to load notes (${res.status})`);

//   return (await res.json()) as NotesResponse;
// }

// // --- Отримати нотатку по ID ---
// export async function getNoteByIdServer(noteId: string): Promise<Note> {
//   const res = await fetch(`${API_URL}/notes/${encodeURIComponent(noteId)}`, {
//     method: "GET",
//     cache: "no-store",
//   });
//   if (!res.ok)
//     throw new Error(`Failed to fetch note ${noteId} (${res.status})`);

//   return (await res.json()) as Note;
// }
