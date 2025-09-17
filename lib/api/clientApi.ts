import type { User } from "@/types/user";

export async function registerUser(
  email: string,
  password: string,
): Promise<User> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
}

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function getCurrentUser(): Promise<User> {
  const res = await fetch("/api/users/me", {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

export async function updateUsername(username: string): Promise<User> {
  const res = await fetch("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}
