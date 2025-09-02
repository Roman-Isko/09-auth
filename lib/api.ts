import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import type { Note, NewNote, NotesResponse } from "../types/note";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (
    error: AxiosError<{ message: string }> & {
      config?: InternalAxiosRequestConfig & { __retryCount?: number };
    },
  ) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    const status = error.response?.status;
    if (status === 429) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      if (config.__retryCount > 3) {
        console.warn(
          `api: 429 received and retry exhausted (tries=${config.__retryCount - 1})`,
        );
        return Promise.reject(error);
      }

      const delay = 1000 * 2 ** (config.__retryCount - 1);
      console.warn(
        `api: 429 received — retry #${config.__retryCount} in ${delay}ms`,
      );
      await new Promise((res) => setTimeout(res, delay));
      return api(config);
    }

    return Promise.reject(error);
  },
);

export async function getNotes(params: {
  page: number;
  search?: string;
  tag?: string;
}): Promise<NotesResponse> {
  const { page, search, tag } = params;

  try {
    const res = await api.get<NotesResponse>("/notes", {
      params: {
        page,
        ...(search ? { search } : {}),
        ...(tag ? { tag } : {}),
      },
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 429) {
      console.warn(
        "api.getNotes: 429 Too Many Requests — returning empty fallback",
      );
      return { notes: [], totalPages: 0 };
    }
    throw err;
  }
}

export async function getNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(payload: NewNote): Promise<Note> {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
}

export async function updateNote(
  id: string,
  patch: Partial<NewNote>,
): Promise<Note> {
  const res = await api.patch<Note>(`/notes/${id}`, patch);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}
