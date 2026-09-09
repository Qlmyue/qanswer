import { create } from 'zustand'
import type { BlogPost, Category, Tag } from '@/types'
import { postApi, categoryApi, tagApi } from '@/services'

// snake_case 转 camelCase
function toCamelCase(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
        toCamelCase(value),
      ])
    )
  }
  return obj
}

interface PostState {
  posts: BlogPost[]
  currentPost: BlogPost | null
  categories: Category[]
  tags: Tag[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null

  // Actions
  fetchPosts: (params?: {
    page?: number
    pageSize?: number
    category?: string
    tag?: string
    search?: string
  }) => Promise<void>
  fetchPost: (slug: string) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchTags: () => Promise<void>
  clearCurrentPost: () => void
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  currentPost: null,
  categories: [],
  tags: [],
  total: 0,
  page: 1,
  pageSize: 12,
  loading: false,
  error: null,

  fetchPosts: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await postApi.getPosts(params)
      set({
        posts: toCamelCase(res.items) as BlogPost[],
        total: res.total,
        page: res.page,
        pageSize: res.pageSize,
        loading: false,
      })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '获取文章列表失败'
      set({ error: message, loading: false })
    }
  },

  fetchPost: async (slug) => {
    set({ loading: true, error: null, currentPost: null })
    try {
      const post = await postApi.getPost(slug)
      set({ currentPost: toCamelCase(post) as BlogPost, loading: false })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '获取文章详情失败'
      set({ error: message, loading: false })
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await categoryApi.getCategories()
      set({ categories: toCamelCase(categories) as Category[] })
    } catch (e: unknown) {
      console.error('获取分类失败:', e)
    }
  },

  fetchTags: async () => {
    try {
      const tags = await tagApi.getTags()
      set({ tags: toCamelCase(tags) as Tag[] })
    } catch (e: unknown) {
      console.error('获取标签失败:', e)
    }
  },

  clearCurrentPost: () => set({ currentPost: null }),
}))
