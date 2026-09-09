import { apiClient } from './index'
import type { Category, CreateCategoryData } from '@/types'

export const categoryApi = {
  // 获取所有分类（树形）
  getCategories(): Promise<Category[]> {
    return apiClient.get('/blog/categories')
  },

  // 创建分类
  createCategory(data: CreateCategoryData): Promise<Category> {
    return apiClient.post('/blog/categories', data)
  },

  // 更新分类
  updateCategory(id: string, data: Partial<CreateCategoryData>): Promise<Category> {
    return apiClient.put(`/blog/categories/${id}`, data)
  },

  // 删除分类
  deleteCategory(id: string): Promise<void> {
    return apiClient.delete(`/blog/categories/${id}`)
  },
}
