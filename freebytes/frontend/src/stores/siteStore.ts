import { create } from 'zustand'
import type { SiteConfig, SiteStats, Danmaku } from '@/types'
import { siteApi, danmakuApi } from '@/services'

interface SiteState {
  config: SiteConfig | null
  stats: SiteStats | null
  danmaku: Danmaku[]
  loading: boolean

  // Actions
  fetchConfig: () => Promise<void>
  fetchHomeData: () => Promise<void>
  fetchDanmaku: () => Promise<void>
  addDanmaku: (content: string, color?: string) => Promise<void>
}

export const useSiteStore = create<SiteState>((set) => ({
  config: null,
  stats: null,
  danmaku: [],
  loading: false,

  fetchConfig: async () => {
    try {
      const config = await siteApi.getConfig()
      set({ config })
    } catch (e) {
      console.error('获取站点配置失败:', e)
    }
  },

  fetchHomeData: async () => {
    set({ loading: true })
    try {
      const data = await siteApi.getHomeData()
      set({
        stats: data.stats,
        danmaku: data.recentDanmaku,
        loading: false,
      })
    } catch (e) {
      console.error('获取首页数据失败:', e)
      set({ loading: false })
    }
  },

  fetchDanmaku: async () => {
    try {
      const danmaku = await danmakuApi.getDanmaku(50)
      set({ danmaku })
    } catch (e) {
      console.error('获取弹幕失败:', e)
    }
  },

  addDanmaku: async (content, color) => {
    try {
      const newDanmaku = await danmakuApi.createDanmaku({
        content,
        color: color || '#ffffff',
        position: 'scroll',
      })
      set((state) => ({
        danmaku: [newDanmaku, ...state.danmaku].slice(0, 50),
      }))
    } catch (e) {
      console.error('发送弹幕失败:', e)
    }
  },
}))
