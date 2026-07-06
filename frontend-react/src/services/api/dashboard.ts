/**
 * Dashboard API Service
 */
import apiClient from './index'

export interface DashboardData {
  totalReviewPoints: number
  reviewedCount: number
  unreviewedCount: number
  todayPractice?: {
    id: string
    question: string
    isAnswered: boolean
  }
  recentActivity: ActivityItem[]
  skillDistribution: SkillDistribution[]
}

export interface ActivityItem {
  id: string
  type: 'review' | 'practice' | 'challenge'
  title: string
  timestamp: string
}

export interface SkillDistribution {
  skill: string
  count: number
  percentage: number
}

export const dashboardApi = {
  /**
   * Get dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    return apiClient.get('/dashboard')
  }
}
