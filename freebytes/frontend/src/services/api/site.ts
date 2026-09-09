import { apiClient } from './index'
import type { SiteConfig, HomeData, UpdateSiteConfigData } from '@/types'

export const siteApi = {
  // 获取站点配置
  getConfig(): Promise<SiteConfig> {
    return apiClient.get('/blog/site')
  },

  // 更新站点配置（管理）
  updateConfig(data: UpdateSiteConfigData): Promise<SiteConfig> {
    return apiClient.put('/blog/site', data)
  },

  // 获取首页数据
  getHomeData(): Promise<HomeData> {
    return apiClient.get('/blog/home')
  },
}
