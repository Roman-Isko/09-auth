import axios, { AxiosInstance } from "axios";
import type { User } from "@/types/user";
import type { Note, NotesResponse, NewNote } from "@/types/note";

const clientApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function signUp(email: string, password: string): Promise<User> {
  const res = await clientApi.post<User>("/auth/register", { email, password });
  return res.data;
}

export async function signIn(email: string, password: string): Promise<User> {
  const res = await clientApi.post<User>("/auth/login", { email, password });
  return res.data;
}

export async function logoutUser(): Promise<void> {
  await clientApi.post("/auth/logout");
}

export async function checkSession(): Promise<User> {
  const res = await clientApi.get<User>("/auth/refresh");
  return res.data;
}

export async function getCurrentUser(): Promise<User> {
  const res = await clientApi.get<User>("/users/me");
  return res.data;
}

export async function updateUsername(username: string): Promise<User> {
  const res = await clientApi.patch<User>("/users/me", { name: username });
  return res.data;
}

export async function getNotes(
  page: number = 1,
  limit: number = 10,
): Promise<NotesResponse> {
  const res = await clientApi.get<NotesResponse>("/notes", {
    params: { page, limit },
  });
  return res.data;
}

export async function getNoteById(noteId: string): Promise<Note> {
  const res = await clientApi.get<Note>(`/notes/${noteId}`);
  return res.data;
}

export async function createNote(payload: NewNote): Promise<Note> {
  const res = await clientApi.post<Note>("/notes", payload);
  return res.data;
}

export async function updateNote(
  noteId: string,
  payload: Partial<NewNote>,
): Promise<Note> {
  const res = await clientApi.patch<Note>(`/notes/${noteId}`, payload);
  return res.data;
}

export async function deleteNote(noteId: string): Promise<void> {
  await clientApi.delete(`/notes/${noteId}`);
}

export default clientApi;
