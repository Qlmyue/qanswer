import { apiClient } from './index'
import type { Comment, CreateCommentData } from '@/types'

export const commentApi = {
  // 获取文章评论
  getComments(postId: string): Promise<Comment[]> {
    return apiClient.get(`/blog/posts/${postId}/comments`)
  },

  // 提交评论
  createComment(postId: string, data: CreateCommentData): Promise<Comment> {
    return apiClient.post(`/blog/posts/${postId}/comments`, data)
  },

  // 删除评论（管理）
  deleteComment(id: string): Promise<void> {
    return apiClient.delete(`/blog/comments/${id}`)
  },

  // 审核评论（管理）
  updateCommentStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    return apiClient.put(`/blog/comments/${id}/status`, { status })
  },
}
