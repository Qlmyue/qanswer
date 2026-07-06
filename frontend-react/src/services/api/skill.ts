/**
 * Skills API Service
 */
import apiClient from './index'

export interface SkillItem {
  id: string
  name: string
  category?: string
  priority?: 'high' | 'medium' | 'low'
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateSkillData {
  name: string
  category?: string
  priority?: 'high' | 'medium' | 'low'
  description?: string
}

export interface UpdateSkillData {
  name?: string
  category?: string
  priority?: 'high' | 'medium' | 'low'
  description?: string
}

export interface SkillFilters {
  category?: string
  priority?: string
}

export interface SkillListResponse {
  items: SkillItem[]
  total: number
}

export const skillApi = {
  /**
   * Get skills list
   */
  async getSkills(filters?: SkillFilters): Promise<SkillListResponse> {
    const params = new URLSearchParams()

    if (filters?.category) {
      params.append('category', filters.category)
    }
    if (filters?.priority) {
      params.append('priority', filters.priority)
    }

    return apiClient.get(`/skills?${params.toString()}`)
  },

  /**
   * Create skill
   */
  async createSkill(data: CreateSkillData): Promise<any> {
    return apiClient.post('/skills', data)
  },

  /**
   * Update skill
   */
  async updateSkill(id: string, data: UpdateSkillData): Promise<any> {
    return apiClient.put(`/skills/${id}`, data)
  },

  /**
   * Delete skill
   */
  async deleteSkill(id: string): Promise<void> {
    return apiClient.delete(`/skills/${id}`)
  }
}
