import axiosInstance from "@/lib/client-api";
import { TLoginRequest, TLoginResponse, TRegisterRequest, TRegisterResponse } from "./auth.types";

export const AuthApi = {
  login: async (payload: TLoginRequest): Promise<TLoginResponse> => {
    const result = await axiosInstance.post<TLoginResponse>("/auth/login", payload)
    return result.data
  },
  register: async (payload: TRegisterRequest): Promise<TRegisterResponse> => {
    const result = await axiosInstance.post<TRegisterResponse>("/auth/register", payload)
    return result.data
  }
}
