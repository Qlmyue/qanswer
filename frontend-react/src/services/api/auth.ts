/**
 * Auth API Service
 */
import apiClient from './index'

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface User {
  id: string
  username: string
  email: string
  created_at?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const authApi = {
  /**
   * User login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post('/auth/login', credentials)
  },

  /**
   * User registration
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post('/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password
    })
  },

  /**
   * User logout
   */
  async logout(): Promise<void> {
    return apiClient.post('/auth/logout')
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get('/auth/me')
  }
}
