import type { ServerUser } from "./types";
import type { User } from "../../types/user";

export async function signIn(payload: { email: string; password: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Sign in failed");
  }

  return res.json() as Promise<ServerUser>;
}

export async function signUp(payload: { email: string; password: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  const res = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Sign up failed");
  }

  return res.json() as Promise<ServerUser>;
}

export async function getUserServer(): Promise<User | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  try {
    const res = await fetch(`${apiUrl}/users/me`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return null;

    const serverUser: ServerUser = await res.json();

    const user: User = {
      id: serverUser.id,
      email: serverUser.email,
      username: serverUser.name || "Unknown",
      avatar: serverUser.avatar || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return user;
  } catch {
    return null;
  }
}
