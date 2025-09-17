// "use server";

// import { cookies } from "next/headers";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// /**
//  * Sign in user
//  */
// export async function signIn(payload: { email: string; password: string }) {
//   const res = await fetch(`${API_URL}/auth/sign-in`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error.message || "Sign in failed");
//   }

//   return res.json();
// }

// /**
//  * Sign up new user
//  */
// export async function signUp(payload: {
//   name: string;
//   email: string;
//   password: string;
// }) {
//   const res = await fetch(`${API_URL}/auth/sign-up`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error.message || "Sign up failed");
//   }

//   return res.json();
// }

// /**
//  * Get current user (server-side)
//  */
// export async function getUserServer() {
//   const cookieStore = cookies();
//   const cookieHeader = cookieStore.toString();

//   const res = await fetch(`${API_URL}/users/me`, {
//     method: "GET",
//     headers: {
//       Cookie: cookieHeader,
//     },
//     credentials: "include",
//     cache: "no-store", // завжди свіжі дані
//   });

//   if (!res.ok) {
//     return null;
//   }

//   return res.json();
// }

// lib/api/serverApi.ts
export type SignInPayload = { email: string; password: string };
export type SignUpPayload = { email: string; password: string };

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function signIn(payload: SignInPayload) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Sign in failed");
  return res.json();
}

export async function signUp(payload: SignUpPayload) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Sign up failed");
  return res.json();
}

export async function getUserServer() {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}
