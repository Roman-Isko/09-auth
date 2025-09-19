import axios, { AxiosInstance, AxiosResponse } from "axios";
import { cookies } from "next/headers";
import type { ServerUser } from "./types";
import type { User } from "../../types/user";
import type { Note, NotesResponse } from "../../types/note";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

const serverApi: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

type CookieEntry = { name: string; value: string };
type CookieStoreLike = {
  getAll: () => CookieEntry[];
  get?: (name: string) => CookieEntry | undefined;
  toString?: () => string;
};

async function resolveCookieStore(): Promise<CookieStoreLike> {
  const maybe = cookies() as unknown;
  if (typeof (maybe as Promise<unknown>)?.then === "function") {
    return await (maybe as Promise<CookieStoreLike>);
  }
  return maybe as CookieStoreLike;
}

function cookieHeaderFromStore(store: CookieStoreLike): string {
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export type TokensResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function signIn(payload: {
  email: string;
  password: string;
}): Promise<ServerUser> {
  const res = await serverApi.post<ServerUser>("/auth/login", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function signUp(payload: {
  email: string;
  password: string;
}): Promise<ServerUser> {
  const res = await serverApi.post<ServerUser>("/auth/register", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function refreshSession(): Promise<AxiosResponse<TokensResponse>> {
  const cookieStore = await resolveCookieStore();
  const cookieHeader = cookieHeaderFromStore(cookieStore);

  return serverApi.get<TokensResponse>("/auth/refresh", {
    headers: { Cookie: cookieHeader },
  });
}

export async function getUserServer(): Promise<User | null> {
  const cookieStore = await resolveCookieStore();
  const cookieHeader = cookieHeaderFromStore(cookieStore);

  try {
    const res = await serverApi.get<ServerUser>("/users/me", {
      headers: { Cookie: cookieHeader },
    });

    const serverUser = res.data;

    return {
      id: serverUser.id,
      email: serverUser.email,
      username: serverUser.name ?? "Unknown",
      avatar: serverUser.avatar ?? "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getNoteById(noteId: string): Promise<Note> {
  const cookieStore = await resolveCookieStore();
  const cookieHeader = cookieHeaderFromStore(cookieStore);

  const res = await serverApi.get<Note>(`/notes/${noteId}`, {
    headers: { Cookie: cookieHeader },
  });
  return res.data;
}

export async function getNotesServer(params: {
  page: number;
  search?: string;
  tag?: string;
}): Promise<NotesResponse> {
  const cookieStore = await resolveCookieStore();
  const cookieHeader = cookieHeaderFromStore(cookieStore);

  const { page, search, tag } = params;

  const queryParams: Record<string, unknown> = { page, perPage: 12 };
  if (search) queryParams.search = search;
  if (tag) queryParams.tag = tag;

  const res = await serverApi.get<NotesResponse>("/notes", {
    headers: { Cookie: cookieHeader },
    params: queryParams,
  });

  return res.data;
}

export default serverApi;
