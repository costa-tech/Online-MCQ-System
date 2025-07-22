import { apiRequest, ApiResponse, setAuthToken, removeAuthToken } from '../utils/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  stats?: {
    totalExams: number;
    averageScore: number;
    passedExams: number;
    passRate: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiRequest<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    // Store the token
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiRequest<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: userData,
    });
    
    // Store the token
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest<ApiResponse<User>>('/auth/profile', {
      requireAuth: true,
    });
  },

  // Update user profile
  updateProfile: async (updates: Partial<Pick<User, 'name' | 'email'>>): Promise<ApiResponse<User>> => {
    return apiRequest<ApiResponse<User>>('/auth/profile', {
      method: 'PUT',
      body: updates,
      requireAuth: true,
    });
  },

  // Change password
  changePassword: async (passwords: { currentPassword: string; newPassword: string }): Promise<ApiResponse<null>> => {
    return apiRequest<ApiResponse<null>>('/auth/change-password', {
      method: 'PUT',
      body: passwords,
      requireAuth: true,
    });
  },

  // Logout user
  logout: (): void => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      // Basic token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};
