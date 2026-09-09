import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/services/api'

interface User {
  id: string
  username: string
  nickname: string
  avatar: string | null
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  // Actions
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (username, password) => {
        set({ loading: true, error: null })
        try {
          const res = await apiClient.post('/auth/login', { username, password })
          const { access_token, user } = res as unknown as { access_token: string; user: User }
          localStorage.setItem('blog_token', access_token)
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            loading: false,
          })
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : '登录失败'
          set({ error: message, loading: false })
        }
      },

      logout: () => {
        localStorage.removeItem('blog_token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'blog-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
