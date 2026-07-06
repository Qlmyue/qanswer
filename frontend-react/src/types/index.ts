// User types
export interface User {
  id: string
  username: string
  email?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

// Review Point types
export type AnswerSource = "ai_generated" | "manual_input"

export interface ReviewPoint {
  id: string
  question: string
  answer: string
  answerSource: AnswerSource
  referenceLinks: string[]
  skillTags: string[]
  isReviewed: boolean
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateReviewPointData {
  question: string
  answer?: string
  answerSource: AnswerSource
  referenceLinks?: string[]
  skillTags?: string[]
}

export interface UpdateReviewPointData {
  question?: string
  answer?: string
  referenceLinks?: string[]
  skillTags?: string[]
}

export interface ReviewPointFilters {
  status?: "reviewed" | "unreviewed"
  skillTag?: string
  keyword?: string
}

export interface ReviewPointListResponse {
  items: ReviewPoint[]
  total: number
  page: number
  page_size: number
}

// Practice types
export interface PracticeQuestion {
  id: string
  question: string
  userAnswer?: string
  isAnswered: boolean
  practiceDate: string
  createdAt: string
}

// Challenge types
export interface DailyChallenge {
  id: string
  reviewPoint: ReviewPoint
  userAnswer?: string
  isCompleted: boolean
  challengeDate: string
  createdAt: string
}

// Report types
export interface WeeklyReport {
  id: string
  weekStart: string
  weekEnd: string
  totalReviewPoints: number
  totalPracticeQuestions: number
  categoryStats: Record<string, { total: number; reviewed: number }>
  weakPoints: string[]
  improvementSuggestions: string[]
  trendComparison: {
    reviewPointsChange: number
    practiceQuestionsChange: number
    reviewRateChange: number
  }
  createdAt: string
}

// Skill types
export type SkillPriority = "high" | "medium" | "low"

export interface SkillItem {
  id: string
  name: string
  description?: string
  category: string
  priority: SkillPriority
  boundary?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSkillData {
  name: string
  description?: string
  category: string
  priority: SkillPriority
  boundary?: string
}

export const SKILL_CATEGORIES = [
  "AI/ML框架",
  "后端开发",
  "数据库",
  "云服务",
  "DevOps",
  "编程语言",
  "软技能",
  "其他",
] as const

// Dashboard types
export interface DashboardStats {
  totalReviewPoints: number
  reviewedPoints: number
  reviewRate: number
  totalPracticeQuestions: number
  weeklyStreak: number
}

export interface DashboardData {
  stats: DashboardStats
  todayChallenge: {
    isCompleted: boolean
    questionPreview: string
  } | null
  todayPractice: {
    isAnswered: boolean
    questionPreview: string
  } | null
  recentReviewPoints: Array<{
    id: string
    question: string
    isReviewed: boolean
    createdAt: string
  }>
}

// API Response types
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}
