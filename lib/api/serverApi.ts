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

// lib/api/serverApi.ts
// Серверні (SSR / Server Components) helper-функції, Edge-friendly (fetch)
import { cookies } from "next/headers";
import type { User } from "../../types/user";
import type { Note, NotesResponse } from "../../types/note";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://notehub-api.goit.study";

type CookieEntry = { name: string; value: string };

async function resolveCookieStoreLike(
  storeArg?: unknown,
): Promise<{ getAll(): CookieEntry[] } | null> {
  const maybe = storeArg ?? cookies();
  // може бути Promise або безпосередній об'єкт
  if (
    typeof maybe === "object" &&
    maybe !== null &&
    "then" in maybe &&
    typeof (maybe as Promise<unknown>).then === "function"
  ) {
    const awaited = (await (maybe as Promise<unknown>)) as unknown;
    if (
      typeof awaited === "object" &&
      awaited !== null &&
      typeof (awaited as { getAll?: unknown }).getAll === "function"
    ) {
      return awaited as { getAll(): CookieEntry[] };
    }
    return null;
  }

  if (
    typeof maybe === "object" &&
    maybe !== null &&
    typeof (maybe as { getAll?: unknown }).getAll === "function"
  ) {
    return maybe as { getAll(): CookieEntry[] };
  }
  return null;
}

async function buildCookieHeaderFromStore(storeArg?: unknown): Promise<string> {
  const store = await resolveCookieStoreLike(storeArg);
  if (!store) return "";
  const parts = store.getAll();
  return parts.map((c) => `${c.name}=${c.value}`).join("; ");
}

export type TokensResponse = {
  accessToken?: string;
  refreshToken?: string;
  setCookieHeader?: string | null;
};

/** refresh session on server-side (returns tokens JSON or null) */
export async function refreshSessionServer(
  cookieHeader?: string,
): Promise<TokensResponse | null> {
  const header = cookieHeader ?? (await buildCookieHeaderFromStore());
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: header ? { Cookie: header } : undefined,
      cache: "no-store",
    });

    if (!res.ok) return null;

    let parsed: unknown = null;
    try {
      parsed = await res.json();
    } catch {
      parsed = null;
    }

    const setCookieHeader = res.headers.get("set-cookie");

    const tokens: TokensResponse = {
      accessToken:
        typeof parsed === "object" && parsed !== null && "accessToken" in parsed
          ? (parsed as { accessToken?: string }).accessToken
          : undefined,
      refreshToken:
        typeof parsed === "object" &&
        parsed !== null &&
        "refreshToken" in parsed
          ? (parsed as { refreshToken?: string }).refreshToken
          : undefined,
      setCookieHeader: setCookieHeader ?? null,
    };

    if (
      !tokens.accessToken &&
      !tokens.refreshToken &&
      !tokens.setCookieHeader
    ) {
      return null;
    }
    return tokens;
  } catch {
    return null;
  }
}

/** Отримати поточного користувача (сервер) */
export async function getUserServer(
  cookieHeader?: string,
): Promise<User | null> {
  const header = cookieHeader ?? (await buildCookieHeaderFromStore());
  try {
    const res = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: header ? { Cookie: header } : undefined,
      cache: "no-store",
    });

    if (!res.ok) return null;
    const serverUser = (await res.json()) as {
      id?: string;
      _id?: string;
      email?: string;
      name?: string;
      username?: string;
      avatar?: string;
      createdAt?: string;
      updatedAt?: string;
    };

    const user: User = {
      id: (serverUser.id ?? serverUser._id ?? "") as string,
      email: serverUser.email ?? "",
      username: serverUser.name ?? serverUser.username ?? "",
      avatar: serverUser.avatar ?? "",
      createdAt: serverUser.createdAt ?? new Date().toISOString(),
      updatedAt: serverUser.updatedAt ?? new Date().toISOString(),
    };

    return user;
  } catch {
    return null;
  }
}

/** Отримати список нот (сервер) */
export async function getNotesServer(params: {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<NotesResponse> {
  const header = await buildCookieHeaderFromStore();
  const url = new URL(`${API_URL}/notes`);
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("perPage", String(params.perPage ?? 12));
  if (params.search) url.searchParams.set("search", params.search);
  if (params.tag) url.searchParams.set("tag", params.tag);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: header ? { Cookie: header } : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load notes (${res.status})`);
  }
  return (await res.json()) as NotesResponse;
}

/** Отримати нотатку по id (сервер) */
export async function getNoteByIdServer(noteId: string): Promise<Note> {
  const header = await buildCookieHeaderFromStore();
  const res = await fetch(`${API_URL}/notes/${encodeURIComponent(noteId)}`, {
    method: "GET",
    headers: header ? { Cookie: header } : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch note ${noteId} (${res.status})`);
  }
  return (await res.json()) as Note;
}

/** Зручний default export (не анонімний) */
export const serverApi = {
  refreshSessionServer,
  getUserServer,
  getNotesServer,
  getNoteByIdServer,
};

export default serverApi;

// // lib/api/serverApi.ts
// import { cookies } from "next/headers";
// import type { User } from "../../types/user";
// import type { Note, NotesResponse } from "../../types/note";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study";

// /* ----- helpers/types ----- */
// type CookieEntry = { name: string; value: string };

// function isThenable(obj: unknown): obj is Promise<unknown> {
//   return (
//     typeof obj === "object" &&
//     obj !== null &&
//     typeof (obj as Promise<unknown>).then === "function"
//   );
// }

// async function resolveCookieStoreLike(
//   storeArg?: unknown,
// ): Promise<{ getAll(): CookieEntry[] } | null> {
//   const maybe = storeArg ?? cookies();
//   const resolved = isThenable(maybe) ? await maybe : maybe;
//   if (
//     typeof resolved === "object" &&
//     resolved !== null &&
//     typeof (resolved as { getAll?: unknown }).getAll === "function"
//   ) {
//     return resolved as { getAll(): CookieEntry[] };
//   }
//   return null;
// }

// async function buildCookieHeaderFromStore(storeArg?: unknown): Promise<string> {
//   const store = await resolveCookieStoreLike(storeArg);
//   if (!store) return "";
//   const parts = store.getAll();
//   // ensure type safety for entries
//   return parts.map((c) => `${c.name}=${c.value}`).join("; ");
// }

// export type TokensResponse = {
//   accessToken?: string;
//   refreshToken?: string;
//   setCookieHeader?: string | null;
// };

// function isTokensCandidate(
//   obj: unknown,
// ): obj is { accessToken?: string; refreshToken?: string } {
//   return (
//     typeof obj === "object" &&
//     obj !== null &&
//     ("accessToken" in (obj as object) || "refreshToken" in (obj as object))
//   );
// }

// /* ----- refresh session (server-side) ----- */
// export async function refreshSessionServer(
//   cookieHeader?: string,
// ): Promise<TokensResponse | null> {
//   const header = cookieHeader ?? (await buildCookieHeaderFromStore());
//   try {
//     const res = await fetch(`${API_URL}/auth/refresh`, {
//       method: "POST",
//       headers: {
//         ...(header ? { Cookie: header } : {}),
//       },
//       cache: "no-store",
//     });

//     if (!res.ok) return null;

//     // try parse JSON safely
//     let parsed: unknown = null;
//     try {
//       parsed = await res.json();
//     } catch {
//       parsed = null;
//     }

//     const setCookieHeader = res.headers.get("set-cookie");

//     const out: TokensResponse = {
//       accessToken: isTokensCandidate(parsed) ? parsed.accessToken : undefined,
//       refreshToken: isTokensCandidate(parsed) ? parsed.refreshToken : undefined,
//       setCookieHeader: setCookieHeader ?? null,
//     };

//     if (!out.accessToken && !out.refreshToken && !out.setCookieHeader)
//       return null;
//     return out;
//   } catch {
//     return null;
//   }
// }

// /* ----- get current user (server-side) ----- */
// type RawServerUser = {
//   id?: string;
//   _id?: string;
//   email?: string;
//   name?: string;
//   username?: string;
//   avatar?: string;
//   createdAt?: string;
//   updatedAt?: string;
// };

// function isRawServerUser(obj: unknown): obj is RawServerUser {
//   return (
//     typeof obj === "object" &&
//     obj !== null &&
//     ("email" in (obj as object) ||
//       "id" in (obj as object) ||
//       "_id" in (obj as object))
//   );
// }

// export async function getUserServer(
//   cookieHeader?: string,
// ): Promise<User | null> {
//   const header = cookieHeader ?? (await buildCookieHeaderFromStore());
//   try {
//     const res = await fetch(`${API_URL}/users/me`, {
//       headers: {
//         ...(header ? { Cookie: header } : {}),
//       },
//       cache: "no-store",
//     });

//     if (!res.ok) return null;

//     const serverUserRaw = await res.json();
//     if (!isRawServerUser(serverUserRaw)) return null;

//     const serverUser = serverUserRaw;

//     const user: User = {
//       id: (serverUser.id ?? serverUser._id ?? "") as string,
//       email: serverUser.email ?? "",
//       username: serverUser.name ?? serverUser.username ?? "",
//       avatar: serverUser.avatar ?? "",
//       createdAt: serverUser.createdAt ?? new Date().toISOString(),
//       updatedAt: serverUser.updatedAt ?? new Date().toISOString(),
//     };

//     return user;
//   } catch {
//     return null;
//   }
// }

// /* ----- get notes server-side ----- */
// export async function getNotesServer(params: {
//   page: number;
//   search?: string;
//   tag?: string;
// }): Promise<NotesResponse> {
//   const header = await buildCookieHeaderFromStore();
//   const url = new URL(`${API_URL}/notes`);
//   url.searchParams.set("page", String(params.page));
//   if (params.search) url.searchParams.set("search", params.search);
//   if (params.tag) url.searchParams.set("tag", params.tag);

//   const res = await fetch(url.toString(), {
//     headers: {
//       ...(header ? { Cookie: header } : {}),
//     },
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error(`Failed to load notes (${res.status})`);
//   }

//   const payload = await res.json();
//   return payload as NotesResponse;
// }

// /* ----- get note by id server-side ----- */
// export async function getNoteByIdServer(noteId: string): Promise<Note> {
//   const header = await buildCookieHeaderFromStore();
//   const res = await fetch(`${API_URL}/notes/${encodeURIComponent(noteId)}`, {
//     headers: {
//       ...(header ? { Cookie: header } : {}),
//     },
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error(`Failed to fetch note ${noteId} (${res.status})`);
//   }

//   const payload = await res.json();
//   return payload as Note;
// }

// /* ----- default export (named const) ----- */
// const serverApi = {
//   refreshSessionServer,
//   getUserServer,
//   getNotesServer,
//   getNoteByIdServer,
// };

// export default serverApi;
