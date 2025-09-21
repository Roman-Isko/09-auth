// import axios, { AxiosInstance } from "axios";
// import type { User } from "@/types/user";
// import type { Note, NotesResponse, NewNote } from "@/types/note";

// const clientApi: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export async function signUp(email: string, password: string): Promise<User> {
//   const res = await clientApi.post<User>("/auth/register", { email, password });
//   return res.data;
// }

// export async function signIn(email: string, password: string): Promise<User> {
//   const res = await clientApi.post<User>("/auth/login", { email, password });
//   return res.data;
// }

// export async function logoutUser(): Promise<void> {
//   await clientApi.post("/auth/logout");
// }

// export async function checkSession(): Promise<User> {
//   const res = await clientApi.get<User>("/auth/refresh");
//   return res.data;
// }

// export async function getCurrentUser(): Promise<User> {
//   const res = await clientApi.get<User>("/users/me");
//   return res.data;
// }

// export async function updateUsername(username: string): Promise<User> {
//   const res = await clientApi.patch<User>("/users/me", { name: username });
//   return res.data;
// }

// export async function getNotes(
//   page: number = 1,
//   limit: number = 10,
// ): Promise<NotesResponse> {
//   const res = await clientApi.get<NotesResponse>("/notes", {
//     params: { page, limit },
//   });
//   return res.data;
// }

// export async function getNoteById(noteId: string): Promise<Note> {
//   const res = await clientApi.get<Note>(`/notes/${noteId}`);
//   return res.data;
// }

// export async function createNote(payload: NewNote): Promise<Note> {
//   const res = await clientApi.post<Note>("/notes", payload);
//   return res.data;
// }

// export async function updateNote(
//   noteId: string,
//   payload: Partial<NewNote>,
// ): Promise<Note> {
//   const res = await clientApi.patch<Note>(`/notes/${noteId}`, payload);
//   return res.data;
// }

// export async function deleteNote(noteId: string): Promise<void> {
//   await clientApi.delete(`/notes/${noteId}`);
// }

// export default clientApi;

// lib/api/clientApi.ts
// Клієнтські API-виклики (fetch, credentials: "include")
import type { User } from "../../types/user";
import type { Note, NotesResponse, NewNote } from "../../types/note";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://notehub-api.goit.study";

type SignPayload = { email: string; password: string };

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Авторизація (логін) */
export async function signIn(email: string, password: string): Promise<User> {
  const payload: SignPayload = { email, password };
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // дуже важливо - браузер відправляє та зберігає кукі
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await parseJsonSafe<{ message?: string }>(res);
    throw new Error(data?.message ?? `Sign in failed (${res.status})`);
  }

  const user = (await res.json()) as User;
  return user;
}

/** Реєстрація */
export async function signUp(email: string, password: string): Promise<User> {
  const payload: SignPayload = { email, password };
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await parseJsonSafe<{ message?: string }>(res);
    throw new Error(data?.message ?? `Sign up failed (${res.status})`);
  }

  const user = (await res.json()) as User;
  return user;
}

/** Вихід */
export async function logoutUser(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

/** Перевірка сесії / отримання поточного користувача (клієнт) */
export async function getCurrentUser(): Promise<User | null> {
  // Для діагностики можна тимчасово раскоментувати лог:
  // console.log("clientApi.getCurrentUser: fetching /users/me (credentials: include)");
  const res = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;
  return (await res.json()) as User;
}

/** Оновити username (PATCH /users/me) */
export async function updateUsername(name: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const data = await parseJsonSafe<{ message?: string }>(res);
    throw new Error(data?.message ?? `Update failed (${res.status})`);
  }
  return (await res.json()) as User;
}

/** Нотатки (client) - зручний wrapper, щоб компоненти викликали getNotes({page, search, tag}) */
export type GetNotesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
};

export async function getNotes(
  params: GetNotesParams = { page: 1, perPage: 12 },
): Promise<NotesResponse> {
  const url = new URL(`${API_URL}/notes`);
  url.searchParams.set("page", String(params.page ?? 1));
  url.searchParams.set("perPage", String(params.perPage ?? 12));
  if (params.search) url.searchParams.set("search", params.search);
  if (params.tag) url.searchParams.set("tag", params.tag);

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load notes (${res.status})`);
  }
  return (await res.json()) as NotesResponse;
}

export async function getNoteById(noteId: string): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${encodeURIComponent(noteId)}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch note (${res.status})`);
  }
  return (await res.json()) as Note;
}

export async function createNote(payload: NewNote): Promise<Note> {
  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await parseJsonSafe<{ message?: string }>(res);
    throw new Error(data?.message ?? `Create failed (${res.status})`);
  }
  return (await res.json()) as Note;
}

export async function updateNote(
  noteId: string,
  payload: Partial<NewNote>,
): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${encodeURIComponent(noteId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await parseJsonSafe<{ message?: string }>(res);
    throw new Error(data?.message ?? `Update failed (${res.status})`);
  }
  return (await res.json()) as Note;
}

export async function deleteNote(noteId: string): Promise<void> {
  const res = await fetch(`${API_URL}/notes/${encodeURIComponent(noteId)}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Delete failed (${res.status})`);
  }
}

// // lib/api/clientApi.ts
// import axios, { AxiosInstance } from "axios";
// import type { User } from "@/types/user";
// import type { Note, NotesResponse, NewNote } from "@/types/note";

// const clientApi: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ================== AUTH ==================
// export async function signUp(email: string, password: string): Promise<User> {
//   const res = await clientApi.post<User>("/auth/register", { email, password });
//   return res.data;
// }

// export async function signIn(email: string, password: string): Promise<User> {
//   const res = await clientApi.post<User>(
//     "/auth/login",
//     { email, password },
//     { withCredentials: true },
//   );
//   return res.data;
// }

// export async function logoutUser(): Promise<void> {
//   await clientApi.post("/auth/logout");
// }

// export async function checkSession(): Promise<User> {
//   const res = await clientApi.get<User>("/auth/refresh");
//   return res.data;
// }

// export async function getCurrentUser(): Promise<User> {
//   const res = await clientApi.get<User>("/users/me", { withCredentials: true });
//   return res.data;
// }

// export async function updateUsername(username: string): Promise<User> {
//   const res = await clientApi.patch<User>("/users/me", { name: username });
//   return res.data;
// }

// // ================== NOTES ==================
// export async function getNotes(
//   page: number = 1,
//   limit: number = 12,
//   search?: string,
//   tag?: string,
// ): Promise<NotesResponse> {
//   const params: Record<string, string | number> = { page, perPage: limit };
//   if (search) params.search = search;
//   if (tag) params.tag = tag;
//   const res = await clientApi.get<NotesResponse>("/notes", { params });
//   return res.data;
// }

// export async function getNoteById(noteId: string): Promise<Note> {
//   const res = await clientApi.get<Note>(`/notes/${noteId}`);
//   return res.data;
// }

// export async function createNote(payload: NewNote): Promise<Note> {
//   const res = await clientApi.post<Note>("/notes", payload);
//   return res.data;
// }

// export async function updateNote(
//   noteId: string,
//   payload: Partial<NewNote>,
// ): Promise<Note> {
//   const res = await clientApi.patch<Note>(`/notes/${noteId}`, payload);
//   return res.data;
// }

// export async function deleteNote(noteId: string): Promise<void> {
//   await clientApi.delete(`/notes/${noteId}`);
// }

// export default clientApi;
