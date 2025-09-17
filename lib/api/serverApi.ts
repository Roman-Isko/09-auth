// import { cookies } from "next/headers";
// import axios from "axios";
// import type { User } from "../../types/user";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// export const getUserServer = async (): Promise<User | null> => {
//   const cookieStore = await cookies();

//   const accessToken = cookieStore.get("accessToken")?.value;
//   const refreshToken = cookieStore.get("refreshToken")?.value;

//   if (!accessToken && !refreshToken) {
//     return null;
//   }

//   try {
//     const response = await axios.get(`${BASE_URL}/auth/current`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//       withCredentials: true,
//     });

//     return response.data as User;
//   } catch {
//     return null;
//   }
// };

export async function signIn(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Login failed");
  }

  return res.json();
}

export async function signUp(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Registration failed");
  }

  return res.json();
}
