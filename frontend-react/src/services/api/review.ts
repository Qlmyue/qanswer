/**
 * Review Points API Service
 */
import apiClient from './index'

export interface ReviewPoint {
  id: string
  question: string
  answer?: string
  answerSource?: 'ai' | 'manual'
  isReviewed?: boolean
  skillTag?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateReviewPointData {
  question: string
  answer?: string
  answer_source?: 'ai' | 'manual'
  skill_tag?: string
}

export interface UpdateReviewPointData {
  question?: string
  answer?: string
  answer_source?: 'ai' | 'manual'
  skill_tag?: string
}

export interface ReviewPointFilters {
  status?: 'reviewed' | 'unreviewed'
  skillTag?: string
  keyword?: string
}

export interface ReviewPointListResponse {
  items: ReviewPoint[]
  total: number
  page: number
  page_size: number
}

export const reviewApi = {
  /**
   * Get review points list
   */
  async getReviewPoints(
    filters?: ReviewPointFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ReviewPointListResponse> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())

    if (filters?.status) {
      params.append('status', filters.status)
    }
    if (filters?.skillTag) {
      params.append('skill_tag', filters.skillTag)
    }
    if (filters?.keyword) {
      params.append('keyword', filters.keyword)
    }

    return apiClient.get(`/review-points?${params.toString()}`)
  },

  /**
   * Get single review point
   */
  async getReviewPoint(id: string): Promise<any> {
    return apiClient.get(`/review-points/${id}`)
  },

  /**
   * Create review point
   */
  async createReviewPoint(data: CreateReviewPointData): Promise<any> {
    return apiClient.post('/review-points', data)
  },

  /**
   * Update review point
   */
  async updateReviewPoint(id: string, data: UpdateReviewPointData): Promise<any> {
    return apiClient.put(`/review-points/${id}`, data)
  },

  /**
   * Toggle review status
   */
  async toggleReviewStatus(id: string, isReviewed: boolean): Promise<any> {
    return apiClient.patch(`/review-points/${id}/review-status`, { is_reviewed: isReviewed })
  },

  /**
   * Delete review point
   */
  async deleteReviewPoint(id: string): Promise<void> {
    return apiClient.delete(`/review-points/${id}`)
  },

  /**
   * Get all skill tags
   */
  async getSkillTags(): Promise<{ tags: string[] }> {
    return apiClient.get('/review-points/tags/all')
  },

  /**
   * Generate AI answer
   */
  async generateAIAnswer(
    question: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    // Call backend AI generation endpoint
    const aiResponse: any = await apiClient.post('/ai/generate-answer', {
      question
    })

    // Check for errors from backend
    if (aiResponse.error) {
      throw new Error(aiResponse.error)
    }

    const answer = aiResponse.answer

    if (!answer) {
      throw new Error('AI生成答案失败：返回内容为空')
    }

    // Simulate streaming output (backend doesn't support SSE yet, frontend displays character by character)
    const chunkSize = 3
    for (let i = 0; i < answer.length; i += chunkSize) {
      await new Promise(resolve => setTimeout(resolve, 15))
      onChunk(answer.substring(i, i + chunkSize))
    }

    // Return answer only, don't create review point (created when user clicks save button)
    return answer
  }
}
