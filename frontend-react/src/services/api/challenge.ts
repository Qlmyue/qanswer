/**
 * Daily Challenge API Service
 */
import apiClient from './index'

export interface DailyChallenge {
  id: string
  reviewPointId: string
  question: string
  userAnswer?: string
  isCompleted?: boolean
  completedAt?: string
  createdAt?: string
}

export interface ChallengeResponse {
  challenge?: DailyChallenge
  hasChallenge?: boolean
}

export const challengeApi = {
  /**
   * Get today's challenge
   */
  async getTodayChallenge(): Promise<ChallengeResponse> {
    return apiClient.get('/challenges/today')
  },

  /**
   * Complete challenge
   */
  async completeChallenge(userAnswer: string): Promise<DailyChallenge> {
    return apiClient.post('/challenges/today/complete', { user_answer: userAnswer })
  }
}
