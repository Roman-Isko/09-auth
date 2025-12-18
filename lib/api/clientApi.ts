import { api } from "./api";
import type { Note, Tag } from "@/types/note";
import type { User } from "@/types/user";

type AuthPayload = {
  email: string;
  password: string;
};

type FetchNotesArgs = {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
};

type CreateNotePayload = {
  title: string;
  content: string;
  tag: Tag;
};

type UpdateNotePayload = {
  title: string;
  content: string;
  tag: Tag;
};

type UpdateMePayload = {
  username?: string;
};

function getErrorMessage(data: any, fallback: string): string {
  if (!data) return fallback;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (Array.isArray(data.errors) && typeof data.errors[0] === "string") {
    return data.errors[0];
  }
  return fallback;
}

export async function fetchNotes({
  page,
  perPage,
  search = "",
  tag,
}: FetchNotesArgs): Promise<Note[]> {
  const params: Record<string, any> = { page, perPage };

  if (search.trim()) params.search = search.trim();
  if (tag && tag !== "all") params.tag = tag;

  const res = await api.get("/notes", { params });

  const data = res.data;

  if (Array.isArray(data)) return data as Note[];
  if (Array.isArray(data?.notes)) return data.notes as Note[];

  return [];
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  if (!id) return null;

  const res = await api.get(`/notes/${encodeURIComponent(id)}`, {
    validateStatus: () => true,
  });

  if (res.status !== 200) {
    throw new Error(getErrorMessage(res.data, "Failed to load note"));
  }

  const data = res.data;

  if (!data) return null;
  if ((data as any).note) return (data as any).note as Note;

  return data as Note;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const res = await api.post("/notes", payload);
  return res.data as Note;
}

export async function updateNote(
  id: string,
  payload: UpdateNotePayload,
): Promise<Note> {
  if (!id) throw new Error("Note id is required");

  const res = await api.patch(`/notes/${encodeURIComponent(id)}`, payload, {
    validateStatus: () => true,
  });

  if (res.status !== 200) {
    throw new Error(getErrorMessage(res.data, "Update note failed"));
  }

  return res.data as Note;
}

export async function deleteNote(id: string): Promise<Note> {
  if (!id) throw new Error("Note id is required");
  const res = await api.delete(`/notes/${encodeURIComponent(id)}`);
  return res.data as Note;
}

export async function register(payload: AuthPayload): Promise<User> {
  const res = await api.post("/auth/register", payload, {
    validateStatus: () => true,
  });

  if (res.status !== 200 && res.status !== 201) {
    throw new Error(getErrorMessage(res.data, "Registration failed"));
  }

  return res.data as User;
}

export async function login(payload: AuthPayload): Promise<User> {
  const res = await api.post("/auth/login", payload, {
    validateStatus: () => true,
  });

  if (res.status !== 200) {
    throw new Error(getErrorMessage(res.data, "Login failed"));
  }

  return res.data as User;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout", {}, { validateStatus: () => true });
}

export async function checkSession(): Promise<boolean> {
  const res = await api.get("/auth/session", {
    validateStatus: () => true,
  });

  const data = res.data as { success?: boolean } | null;
  return !!data?.success;
}

export async function getMe(): Promise<User | null> {
  const res = await api.get("/users/me", {
    validateStatus: () => true,
  });

  if (res.status !== 200 || !res.data) return null;
  return res.data as User;
}

export async function updateMe(payload: UpdateMePayload): Promise<User> {
  const res = await api.patch("/users/me", payload, {
    validateStatus: () => true,
  });

  if (res.status !== 200) {
    throw new Error(getErrorMessage(res.data, "Update profile failed"));
  }

  return res.data as User;
}
