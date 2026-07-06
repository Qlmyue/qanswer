/**
 * Practice Questions API Service
 */
import apiClient from './index'

export interface PracticeQuestion {
  id: string
  question: string
  userAnswer?: string
  isAnswered?: boolean
  createdAt?: string
}

export const practiceApi = {
  /**
   * Get today's practice question
   */
  async getTodayPractice(): Promise<PracticeQuestion> {
    return apiClient.get('/practice/today')
  },

  /**
   * Submit answer
   */
  async submitAnswer(answer: string): Promise<PracticeQuestion> {
    return apiClient.post('/practice/today/answer', { answer })
  }
}
