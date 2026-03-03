import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { STATICS_CONFIG } from '../config/statics';
import { AppError } from '@/src/config/app-error';

const baseURL = '';

const getAuthHeaders = (): Record<string, string> => {
  const token = Cookies.get(STATICS_CONFIG.cookies.authToken);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiRequest = async <Response>(
  requestFn: () => Promise<Response>
): Promise<Response> => {
  try {
    return await requestFn();
  } catch (error: any) {
    throw new AppError<undefined>(
      `Server error: ${error?.message || 'Unknown error'}`,
      undefined,
      500
    );
  }
};

const get = async <Response>(url: string): Promise<Response> => {
  return handleApiRequest<Response>(async () => {
    const response = await axios.get(url, {
      baseURL,
      headers: getAuthHeaders(),
    });
    return response.data;
  });
};

const post = async <Data, Response>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig
): Promise<Response> => {
  return handleApiRequest<Response>(async () => {
    const response = await axios.post(url, data ?? {}, {
      baseURL,
      headers: {
        ...getAuthHeaders(),
        ...config?.headers,
      },
      ...config,
    });
    return response.data;
  });
};

const put = async <Data, Response>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig
): Promise<Response> => {
  return handleApiRequest<Response>(async () => {
    const response = await axios.put(url, data ?? {}, {
      baseURL,
      headers: {
        ...getAuthHeaders(),
        ...config?.headers,
      },
      ...config,
    });
    return response.data;
  });
};

const del = async <Response>(
  url: string,
  config?: AxiosRequestConfig
): Promise<Response> => {
  return handleApiRequest<Response>(async () => {
    const response = await axios.delete(url, {
      baseURL,
      headers: {
        ...getAuthHeaders(),
        ...config?.headers,
      },
      ...config,
    });
    return response.data;
  });
};

export const api = {
  get,
  post,
  put,
  delete: del,
};
