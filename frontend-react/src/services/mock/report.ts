import type { WeeklyReport } from "@/types"

export const reportService = {
  async getWeeklyReport(weekOffset: number = 0): Promise<{ code: number; data: { report: WeeklyReport } }> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay() - 7 * weekOffset)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const formatDate = (d: Date) => d.toISOString().split("T")[0]

    const report: WeeklyReport = {
      id: "1",
      weekStart: formatDate(weekStart),
      weekEnd: formatDate(weekEnd),
      totalReviewPoints: 8,
      totalPracticeQuestions: 5,
      categoryStats: {
        "React": { total: 5, reviewed: 3 },
        "JavaScript": { total: 4, reviewed: 4 },
        "CSS": { total: 3, reviewed: 1 },
        "Node.js": { total: 2, reviewed: 2 },
      },
      weakPoints: [
        "CSS 盒模型和定位布局掌握不够扎实",
        "React Hooks 的使用场景需要加强",
        "异步编程和 Promise 链式调用容易出错",
      ],
      improvementSuggestions: [
        "建议每天复习一个 CSS 布局知识点，配合实际练习",
        "深入学习 React Hooks 的底层原理和最佳实践",
        "多做异步编程相关的练习题，特别是 async/await",
      ],
      trendComparison: {
        reviewPointsChange: 3,
        practiceQuestionsChange: 2,
        reviewRateChange: 0.15,
      },
      createdAt: new Date().toISOString(),
    }

    return { code: 200, data: { report } }
  },
}
