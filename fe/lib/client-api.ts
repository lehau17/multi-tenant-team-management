// src/lib/axios.ts
import { IWrapperRespose } from '@/models/base-response.model';
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

/**
 * Typed API client — reflects the response interceptor that unwraps
 * AxiosResponse and returns the raw body (IWrapperRespose<T>) directly.
 *
 * Usage:  const res = await api.post<MyDto>('/endpoint', payload);
 *         res.status // number
 *         res.data   // MyDto
 */
export interface ApiClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<IWrapperRespose<T>>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IWrapperRespose<T>>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IWrapperRespose<T>>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IWrapperRespose<T>>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<IWrapperRespose<T>>;
}

// 1. Cấu hình chung
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9999/api/v1",
  timeout: 10000, // 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const isServer = typeof window === 'undefined';

    if (isServer) {

    } else {
      const token = Cookies.get('accessToken');
      // Hoặc lấy từ cookie client: document.cookie...

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data, // Trả về data luôn cho gọn (bỏ qua bước .data ở nơi gọi)
  async (error) => {
    if (error.response?.status === 401) {
       if (typeof window !== 'undefined') {
         // window.location.href = '/login';
       }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance as unknown as ApiClient;
