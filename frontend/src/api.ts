import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Type definitions for your book data
export interface Book {
  url: string;
  integration_name: string;
  author: string;
  book: string;
  date: string;
  integration: number;
}

export interface BookFilters {
  search?: string;
  integration?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface BookResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

// Configure your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export const bookAPI = {
  getAllBooks: async (): Promise<Book[]> => {
    const response = await api.get<BookResponse>('/bookclub');
    return response.data.results;
  },

  getBooks: async (params?: BookFilters): Promise<BookResponse> => {
    const response = await api.get<BookResponse>('/bookclub', { params });
    return response.data;
  },

  getBookById: async (url: string): Promise<Book> => {
    const response = await api.get<Book>(`/bookclub/${url}`);
    return response.data;
  },

  searchBooks: async (query: string): Promise<Book[]> => {
    const response = await api.get<Book[]>('/bookclub/search', { 
      params: { q: query } 
    });
    return response.data;
  },

  getIntegrations: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/integrations');
    return response.data;
  },
};

export default api;