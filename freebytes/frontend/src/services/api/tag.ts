import { apiClient } from './index'
import type { Tag } from '@/types'

export const tagApi = {
  // 获取所有标签
  getTags(): Promise<Tag[]> {
    return apiClient.get('/blog/tags')
  },
}
