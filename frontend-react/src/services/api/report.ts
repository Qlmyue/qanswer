/**
 * Weekly Report API Service
 */
import apiClient from './index'

export interface WeeklyReport {
  id: string
  weekStart: string
  weekEnd: string
  totalReviewed: number
  totalPractice: number
  skillStats: SkillStat[]
  summary?: string
  createdAt?: string
}

export interface SkillStat {
  skill: string
  count: number
  percentage: number
}

export const reportApi = {
  /**
   * Get weekly report
   */
  async getWeeklyReport(weekOffset: number = 0): Promise<{ report: WeeklyReport }> {
    return apiClient.get(`/analysis/weekly?week_offset=${weekOffset}`)
  }
}
