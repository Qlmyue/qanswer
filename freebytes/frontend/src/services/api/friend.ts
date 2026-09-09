import { apiClient } from './index'
import type { FriendLink, CreateFriendData } from '@/types'

export const friendApi = {
  // 获取友链列表
  getFriends(): Promise<FriendLink[]> {
    return apiClient.get('/blog/friends')
  },

  // 申请友链
  createFriend(data: CreateFriendData): Promise<FriendLink> {
    return apiClient.post('/blog/friends', data)
  },

  // 更新友链（管理）
  updateFriend(id: string, data: Partial<CreateFriendData>): Promise<FriendLink> {
    return apiClient.put(`/blog/friends/${id}`, data)
  },

  // 删除友链（管理）
  deleteFriend(id: string): Promise<void> {
    return apiClient.delete(`/blog/friends/${id}`)
  },
}
