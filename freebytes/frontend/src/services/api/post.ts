import { apiClient } from './index'
import type { BlogPost, PaginatedResponse, CreatePostData, UpdatePostData } from '@/types'

export const postApi = {
  // 获取文章列表
  getPosts(params?: {
    page?: number
    pageSize?: number
    category?: string
    tag?: string
    search?: string
    status?: string
  }): Promise<PaginatedResponse<BlogPost>> {
    return apiClient.get('/blog/posts', { params })
  },

  // 获取文章详情（通过 slug）
  getPost(slug: string): Promise<BlogPost> {
    return apiClient.get(`/blog/posts/${slug}`)
  },

  // 获取原始 Markdown（编辑用）
  getPostRaw(id: string): Promise<{ content: string }> {
    return apiClient.get(`/blog/posts/${id}/raw`)
  },

  // 创建文章
  createPost(data: CreatePostData): Promise<BlogPost> {
    return apiClient.post('/blog/posts', data)
  },

  // 更新文章
  updatePost(id: string, data: UpdatePostData): Promise<BlogPost> {
    return apiClient.put(`/blog/posts/${id}`, data)
  },

  // 删除文章
  deletePost(id: string): Promise<void> {
    return apiClient.delete(`/blog/posts/${id}`)
  },
}
