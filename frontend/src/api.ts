import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Type definitions for your book data
export interface Book {
  id: string;
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

export interface Integration {
  id: string;
  name: string;
}

export interface IntegrationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Integration[];
}
// Configure your backend URL
const API_BASE_URL = 'https://the-green-papaya-api.fly.dev';

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
  getAllBooks: async (): Promise<BookResponse> => {
    let allBooks: Book[] = [];
    let nextUrl: string | null = '/bookclub/';
    let count = 0;

    // Fetch all pages by following the 'next' URL
    while (nextUrl) {
      const response = await api.get<BookResponse>(nextUrl);
      allBooks = [...allBooks, ...response.data.results];
      count = response.data.count;

      // Extract the path and query params from the next URL
      if (response.data.next) {
        const url = new URL(response.data.next);
        nextUrl = `${url.pathname}${url.search}`;
      } else {
        nextUrl = null;
      }
    }

    return {
      count,
      next: null,
      previous: null,
      results: allBooks,
    };
  },

  getBooks: async (params?: BookFilters): Promise<BookResponse> => {
    const response = await api.get<BookResponse>('/bookclub/', { params });
    return response.data;
  },

  getBookById: async (id: string): Promise<Book> => {
    const response = await api.get<Book>(`/bookclub/${id}/`);
    return response.data;
  },

  searchBooks: async (query: string): Promise<Book[]> => {
    const response = await api.get<Book[]>('/bookclub/search/', {
      params: { q: query }
    });
    return response.data;
  },

  getIntegrations: async (): Promise<Integration[]> => {
    const response = await api.get<IntegrationResponse>('/integrations/');
    return response.data.results;
  },
};

export default api;