import { apiClient } from './index'
import type { Danmaku, CreateDanmakuData } from '@/types'

export const danmakuApi = {
  // 获取弹幕列表
  getDanmaku(limit?: number): Promise<Danmaku[]> {
    return apiClient.get('/blog/danmaku', { params: { limit } })
  },

  // 发送弹幕
  createDanmaku(data: CreateDanmakuData): Promise<Danmaku> {
    return apiClient.post('/blog/danmaku', data)
  },

  // 删除弹幕（管理）
  deleteDanmaku(id: string): Promise<void> {
    return apiClient.delete(`/blog/danmaku/${id}`)
  },
}
