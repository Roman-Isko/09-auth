import { cookies } from "next/headers";
import axios from "axios";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface NotesParams {
  page?: number;
  search?: string;
  tag?: string;
}

const refreshAccessToken = async (refreshToken: string) => {
  const response = await axios.post(
    `${BASE_URL}/auth/refresh`,
    {},
    {
      headers: { Cookie: `refreshToken=${refreshToken}` },
      withCredentials: true,
    },
  );
  return response.data.accessToken as string;
};

export const getNotesSSR = async (params: NotesParams) => {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) redirect("/sign-in");

  if (!accessToken && refreshToken) {
    try {
      accessToken = await refreshAccessToken(refreshToken);
    } catch {
      redirect("/sign-in");
    }
  }

  try {
    const response = await axios.get(`${BASE_URL}/notes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401 && refreshToken) {
        try {
          accessToken = await refreshAccessToken(refreshToken);
          const retryRes = await axios.get(`${BASE_URL}/notes`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params,
            withCredentials: true,
          });
          return retryRes.data;
        } catch {
          redirect("/sign-in");
        }
      } else {
        redirect("/sign-in");
      }
    } else {
      redirect("/sign-in");
    }
  }
};
