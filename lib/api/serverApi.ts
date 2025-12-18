// lib/api/serverApi.ts
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

/**
 * Хелпер для GET-запитів, які повертають JSON.
 * Використовується лише у server components / middleware.
 */
async function getJSON<T>(
  path: string,
  params?: Record<string, any>,
): Promise<T | null> {
  const cookieHeader = cookies().toString();

  const search =
    params && Object.keys(params).length
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce<Record<string, string>>(
            (acc, [key, value]) => {
              if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
              ) {
                acc[key] = String(value);
              }
              return acc;
            },
            {},
          ),
        ).toString()
      : "";

  const res = await fetch(`${baseURL}${path}${search}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });

  if (!res.ok) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/* ========= Notes ========= */

type FetchNotesArgs = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
};

export async function fetchNotes(args: FetchNotesArgs): Promise<Note[]> {
  const { page = 1, perPage = 12, search = "", tag } = args ?? {};

  const params: Record<string, any> = { page, perPage };
  if (search.trim()) params.search = search.trim();
  if (tag && tag !== "all") params.tag = tag;

  const data = await getJSON<any>("/notes", params);

  if (!data) return [];
  if (Array.isArray(data)) return data as Note[];
  if (Array.isArray((data as any).notes)) return (data as any).notes as Note[];

  return [];
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  if (!id) return null;
  const data = await getJSON<Note>(`/notes/${encodeURIComponent(id)}`);
  return data ?? null;
}

/* ========= Auth / User ========= */

export async function getMe(): Promise<User | null> {
  const data = await getJSON<User>("/users/me");
  return data ?? null;
}

/**
 * checkSession
 *
 * Для middleware: повертаємо "майже AxiosResponse":
 * - ok, status
 * - data (parsed body)
 * - headers (plain object)
 */
export async function checkSession(cookieHeader?: string): Promise<{
  ok: boolean;
  status: number;
  data: any | null;
  headers: Record<string, string>;
}> {
  const headers: HeadersInit = {};

  if (cookieHeader && cookieHeader.trim()) {
    (headers as any).cookie = cookieHeader;
  } else {
    const c = cookies().toString();
    if (c) (headers as any).cookie = c;
  }

  const res = await fetch(`${baseURL}/auth/session`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  let data: any | null = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  const plainHeaders: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    plainHeaders[key.toLowerCase()] = value;
  });

  return {
    ok: res.ok,
    status: res.status,
    data,
    headers: plainHeaders,
  };
}
