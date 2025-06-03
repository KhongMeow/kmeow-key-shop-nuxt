import axios from "axios";
import type { IAPIOption } from "~/types/api";

export const useApi = async <T>(endpoint: string, options: IAPIOption) => {
  const baseUrl = useRuntimeConfig().public.API_BASE_URL;

  const token = process.client ? localStorage.getItem('access_token') : null;
  options.headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  try {
    const response = await axios<T>(baseUrl + endpoint, options);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};