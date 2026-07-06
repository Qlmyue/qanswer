import type { DailyChallenge, ReviewPoint } from "@/types"

const mockReviewPoint: ReviewPoint = {
  id: "1",
  question: "请解释 React 中的虚拟 DOM 是什么？",
  answer: "虚拟 DOM 是 React 用来提高性能的一种技术。",
  answerSource: "ai_generated",
  referenceLinks: ["https://react.dev/learn"],
  skillTags: ["React", "前端框架"],
  isReviewed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

let mockChallenge: DailyChallenge = {
  id: "1",
  reviewPoint: mockReviewPoint,
  isCompleted: false,
  challengeDate: new Date().toISOString().split("T")[0],
  createdAt: new Date().toISOString(),
}

export const challengeService = {
  async getTodayChallenge(): Promise<DailyChallenge | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockChallenge
  },

  async completeChallenge(id: string, answer: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    mockChallenge = {
      ...mockChallenge,
      userAnswer: answer,
      isCompleted: true,
    }
    return { code: 200 }
  },
}
