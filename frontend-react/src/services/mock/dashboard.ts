import type { DashboardData } from "@/types"

// Mock data for dashboard
const mockDashboardData: DashboardData = {
  stats: {
    totalReviewPoints: 25,
    reviewedPoints: 18,
    reviewRate: 0.72,
    totalPracticeQuestions: 12,
    weeklyStreak: 5,
  },
  todayChallenge: {
    isCompleted: false,
    questionPreview: "请解释 React 中的虚拟 DOM 是什么？",
  },
  todayPractice: {
    isAnswered: true,
    questionPreview: "请描述 JavaScript 中的闭包概念",
  },
  recentReviewPoints: [
    {
      id: "1",
      question: "请解释 React 中的虚拟 DOM 是什么？",
      isReviewed: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "2",
      question: "请描述 JavaScript 中的闭包概念",
      isReviewed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "3",
      question: "请解释 CSS 盒模型的工作原理",
      isReviewed: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ],
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockDashboardData
  },
}
