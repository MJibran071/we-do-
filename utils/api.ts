
import { toast } from 'sonner';
import { logger } from './logger';

// Smart base URL detection with environment variable support
const getBaseUrl = (): string => {
    if (typeof window === 'undefined') {
        return import.meta.env.VITE_API_URL || 'http://localhost:3000';
    }
    
    // Use environment variable if available
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // If running on localhost or loopback, assume local backend port
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    
    // In production, cloud IDEs (StackBlitz, Replit, etc), or deployed envs, 
    // the backend is likely proxied via the same origin or configured via env var.
    // If no env var is set, default to relative path to allow proxying.
    return ''; 
};

export const API_BASE_URL = getBaseUrl();

interface ApiOptions extends RequestInit {
  skipErrorHandling?: boolean;
  timeout?: number;
  retries?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout = 30000; // 30 seconds
  private defaultRetries = 3;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Retry on network errors or 5xx errors
      return error.message === 'Failed to fetch' || 
             error.message.includes('NetworkError') ||
             error.message.includes('Network request failed');
    }
    return false;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    // Ensure proper url formatting
    const url = `${this.baseUrl}${endpoint}`.replace(/([^:]\/)\/+/g, "$1");
    const timeout = options.timeout || this.defaultTimeout;
    const retries = options.retries ?? this.defaultRetries;

    // Add authentication token if available
    const token = localStorage.getItem('access_token');
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...authHeaders,
    };

    const makeRequest = async (attempt: number): Promise<T> => {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      try {
        const config: RequestInit = {
          ...options,
          signal: options.signal || controller.signal,
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
        };

        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        if (!response.ok) {
          // Try to parse error message from JSON, fallback to status text
          let errorMessage = `HTTP Error ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = response.statusText || errorMessage;
          }
          
          const error = new Error(errorMessage);
          // Don't retry on 4xx errors (client errors)
          if (response.status >= 400 && response.status < 500) {
            throw error;
          }
          // Retry on 5xx errors (server errors)
          throw error;
        }

        // For 204 No Content
        if (response.status === 204) {
          return {} as T;
        }

        return await response.json();
      } catch (error: unknown) {
        clearTimeout(timeoutId);

        // Retry logic with exponential backoff
        if (attempt < retries && this.isRetryableError(error)) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
          logger.debug(`API request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`, { endpoint, attempt });
          await new Promise(resolve => setTimeout(resolve, delay));
          return makeRequest(attempt + 1);
        }

        throw error;
      }
    };

    try {
      return await makeRequest(0);
    } catch (error: unknown) {
      // If skipErrorHandling is true, rethrow without global toast/logging
      if (options.skipErrorHandling) {
        throw error;
      }

      // Global error handling
      logger.error(`API Error (${endpoint})`, error);
      
      if (!options.signal?.aborted) {
        // Friendly error message for connection issues
        let msg = 'An unexpected error occurred';
        if (error instanceof Error) {
          msg = error.message === 'Failed to fetch' 
            ? 'Unable to connect to server. Is the backend running?' 
            : error.message;
        }

        toast.error(`Operation failed`, {
          description: msg
        });
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  async put<T>(endpoint: string, body: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  async patch<T>(endpoint: string, body: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  async delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);
