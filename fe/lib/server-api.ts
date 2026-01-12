// src/lib/server-api.ts
import { cookies } from "next/headers";
import axiosInstance from "./client-api";

export const serverApi = async (url: string, method: string = 'GET', data?: any) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  return axiosInstance({
    url,
    method,
    data,
    headers: {
      Authorization: `Bearer ${accessToken}`, // Tự động gắn token server
    },
  });
};
