/**
 * API Client
 * Real API service for Phase 2
 */
import axios from 'axios'

// Create axios instance
const apiClient = axios.create({
  // Use Vite's same-origin proxy in development. This avoids a CORS failure
  // when the app is opened through 127.0.0.1 instead of localhost.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        // Token expired or invalid: fully clear auth state.
        // Clearing ONLY 'token'/'user' leaves the zustand persist storage
        // ('auth-storage') intact, so isAuthenticated stays true and the
        // router loops between /dashboard and /login forever (page flicker).
        localStorage.removeItem('auth-storage')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Avoid a redirect loop when already on the login page.
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }

      return Promise.reject(data)
    }

    return Promise.reject(error)
  }
)

export default apiClient
