import type {
  ReviewPoint,
  ReviewPointFilters,
  CreateReviewPointData,
  ReviewPointListResponse,
} from "@/types"

// Mock data for review points
const mockReviewPoints: ReviewPoint[] = [
  {
    id: "1",
    question: "请解释 React 中的虚拟 DOM 是什么？",
    answer:
      "虚拟 DOM 是 React 用来提高性能的一种技术。它是真实 DOM 的一个轻量级副本，存储在内存中。当组件状态发生变化时，React 会创建一个新的虚拟 DOM 树，与之前的树进行比较（这个过程称为'协调'），然后只更新实际发生变化的 DOM 节点。",
    answerSource: "ai_generated",
    referenceLinks: ["https://react.dev/learn"],
    skillTags: ["React", "前端框架"],
    isReviewed: true,
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "2",
    question: "请描述 JavaScript 中的闭包概念",
    answer:
      "闭包是指一个函数能够访问其外部函数作用域中的变量，即使外部函数已经执行完毕。闭包在 JavaScript 中非常常见，用于数据封装、函数工厂等场景。",
    answerSource: "manual_input",
    referenceLinks: [],
    skillTags: ["JavaScript", "编程基础"],
    isReviewed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "3",
    question: "请解释 CSS 盒模型的工作原理",
    answer:
      "CSS 盒模型描述了元素在页面中占据的空间，由内容（content）、内边距（padding）、边框（border）和外边距（margin）组成。box-sizing 属性可以改变盒模型的计算方式。",
    answerSource: "ai_generated",
    referenceLinks: ["https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model"],
    skillTags: ["CSS", "前端基础"],
    isReviewed: true,
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
]

let nextId = 4

export const reviewService = {
  async getReviewPoints(
    filters?: ReviewPointFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ReviewPointListResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filtered = [...mockReviewPoints]

    if (filters?.status === "reviewed") {
      filtered = filtered.filter((rp) => rp.isReviewed)
    } else if (filters?.status === "unreviewed") {
      filtered = filtered.filter((rp) => !rp.isReviewed)
    }

    if (filters?.skillTag) {
      filtered = filtered.filter((rp) =>
        rp.skillTags.includes(filters.skillTag!)
      )
    }

    if (filters?.keyword) {
      const keyword = filters.keyword.toLowerCase()
      filtered = filtered.filter(
        (rp) =>
          rp.question.toLowerCase().includes(keyword) ||
          rp.answer.toLowerCase().includes(keyword)
      )
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = filtered.slice(start, end)

    return {
      items,
      total: filtered.length,
      page,
      page_size: pageSize,
    }
  },

  async getReviewPoint(id: string): Promise<{ review_point: ReviewPoint }> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const point = mockReviewPoints.find((rp) => rp.id === id)
    if (!point) {
      throw new Error("Review point not found")
    }
    return { review_point: point }
  },

  async createReviewPoint(
    data: CreateReviewPointData
  ): Promise<{ review_point: ReviewPoint }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newPoint: ReviewPoint = {
      id: String(nextId++),
      question: data.question,
      answer: data.answer || "AI 生成的答案（模拟）",
      answerSource: data.answer ? data.answerSource : "ai_generated",
      referenceLinks: data.referenceLinks || [],
      skillTags: data.skillTags || [],
      isReviewed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockReviewPoints.unshift(newPoint)
    return { review_point: newPoint }
  },

  async updateReviewPoint(
    id: string,
    data: any
  ): Promise<{ review_point: ReviewPoint }> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const index = mockReviewPoints.findIndex((rp) => rp.id === id)
    if (index === -1) {
      throw new Error("Review point not found")
    }

    const updatedPoint = {
      ...mockReviewPoints[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    mockReviewPoints[index] = updatedPoint
    return { review_point: updatedPoint }
  },

  async toggleReviewStatus(
    id: string,
    isReviewed: boolean
  ): Promise<{ review_point: ReviewPoint }> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const index = mockReviewPoints.findIndex((rp) => rp.id === id)
    if (index === -1) {
      throw new Error("Review point not found")
    }

    mockReviewPoints[index] = {
      ...mockReviewPoints[index],
      isReviewed,
      reviewedAt: isReviewed ? new Date().toISOString() : undefined,
    }

    return { review_point: mockReviewPoints[index] }
  },

  async deleteReviewPoint(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = mockReviewPoints.findIndex((rp) => rp.id === id)
    if (index === -1) {
      throw new Error("Review point not found")
    }

    mockReviewPoints.splice(index, 1)
  },

  async getSkillTags(): Promise<{ tags: string[] }> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const tags = new Set<string>()
    mockReviewPoints.forEach((rp) => {
      rp.skillTags.forEach((tag) => tags.add(tag))
    })

    return { tags: Array.from(tags) }
  },

  async generateAIAnswer(
    question: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const answer = `这是关于"${question}"的 AI 生成答案（模拟）。\n\n这个答案包含了详细的解释和相关资源链接。在实际应用中，这将调用后端 AI 服务生成真实的答案。`

    // Simulate streaming output
    const chunkSize = 3
    for (let i = 0; i < answer.length; i += chunkSize) {
      await new Promise((resolve) => setTimeout(resolve, 15))
      onChunk(answer.substring(i, i + chunkSize))
    }

    return answer
  },
}
