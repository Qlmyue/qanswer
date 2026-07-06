import type { PracticeQuestion } from "@/types"

let mockPractice: PracticeQuestion = {
  id: "1",
  question: "请描述 JavaScript 中的闭包概念，并给出一个实际应用场景。",
  isAnswered: false,
  practiceDate: new Date().toISOString().split("T")[0],
  createdAt: new Date().toISOString(),
}

export const practiceService = {
  async getTodayPractice(): Promise<PracticeQuestion> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockPractice
  },

  async submitAnswer(answer: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    mockPractice = {
      ...mockPractice,
      userAnswer: answer,
      isAnswered: true,
    }
    return { code: 200 }
  },
}
