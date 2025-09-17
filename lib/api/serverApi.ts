// lib/api/serverApi.ts

import type { ServerUser } from "./types";
import type { User } from "../../types/user";

// ----------------------
// Sign In
// ----------------------
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

// ----------------------
// Sign Up
// ----------------------
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

// ----------------------
// Get Current User (Server-Side)
// ----------------------
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

    // маппінг у наш доменний тип User
    const user: User = {
      id: serverUser.id,
      email: serverUser.email,
      username: serverUser.name || "Unknown",
      avatar: serverUser.avatar || "",
      createdAt: new Date().toISOString(), // заглушки, бо бекенд їх не віддає
      updatedAt: new Date().toISOString(),
    };

    return user;
  } catch {
    return null;
  }
}

// export type SignInPayload = { email: string; password: string };
// export type SignUpPayload = { email: string; password: string };

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function signIn(payload: SignInPayload) {
//   const res = await fetch(`${BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Sign in failed");
//   return res.json();
// }

// export async function signUp(payload: SignUpPayload) {
//   const res = await fetch(`${BASE_URL}/auth/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Sign up failed");
//   return res.json();
// }

// export async function getUserServer() {
//   const res = await fetch(`${BASE_URL}/users/me`, {
//     method: "GET",
//     credentials: "include",
//   });
//   if (!res.ok) return null;
//   return res.json();
// }
