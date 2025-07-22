// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
    value: any;
  }>;
  timestamp: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Helper function to create request headers
const createHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    requireAuth?: boolean;
    query?: Record<string, string | number>;
  } = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    requireAuth = false,
    query
  } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  // Add query parameters
  if (query) {
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      searchParams.append(key, value.toString());
    });
    url += `?${searchParams.toString()}`;
  }

  const config: RequestInit = {
    method,
    headers: createHeaders(requireAuth),
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Health check function
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
  return response.json();
};
