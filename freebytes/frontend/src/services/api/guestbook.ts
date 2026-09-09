import { apiClient } from './index'
import type { GuestbookMessage, CreateGuestbookData, PaginatedResponse } from '@/types'

export const guestbookApi = {
  // 获取留言列表
  getMessages(params?: { page?: number; pageSize?: number }): Promise<PaginatedResponse<GuestbookMessage>> {
    return apiClient.get('/blog/guestbook', { params })
  },

  // 提交留言
  createMessage(data: CreateGuestbookData): Promise<GuestbookMessage> {
    return apiClient.post('/blog/guestbook', data)
  },

  // 删除留言（管理）
  deleteMessage(id: string): Promise<void> {
    return apiClient.delete(`/blog/guestbook/${id}`)
  },
}
