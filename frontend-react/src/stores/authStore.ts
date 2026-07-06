import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi } from "@/services/api/auth"

interface User {
  id: string
  username: string
  email?: string
  created_at?: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  register: (data: { username: string; email: string; password: string }) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      login: async (credentials) => {
        set({ loading: true, error: null })
        try {
          // Real API call
          const response = await authApi.login(credentials)

          if (response.user && response.token) {
            // Store in localStorage
            localStorage.setItem('token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))

            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              loading: false,
            })
            return true
          } else {
            set({ error: "登录失败", loading: false })
            return false
          }
        } catch (e: any) {
          const errorMessage = e?.detail || e?.message || "登录失败，请重试"
          set({ error: errorMessage, loading: false })
          return false
        }
      },

      register: async (data) => {
        set({ loading: true, error: null })
        try {
          // Real API call
          const response = await authApi.register(data)

          if (response.user && response.token) {
            // Store in localStorage
            localStorage.setItem('token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))

            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              loading: false,
            })
            return true
          } else {
            set({ error: "注册失败", loading: false })
            return false
          }
        } catch (e: any) {
          const errorMessage = e?.detail || e?.message || "注册失败，请重试"
          set({ error: errorMessage, loading: false })
          return false
        }
      },

      logout: async () => {
        set({ loading: true })
        try {
          await authApi.logout()
        } finally {
          // Clear localStorage
          localStorage.removeItem('token')
          localStorage.removeItem('user')

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
