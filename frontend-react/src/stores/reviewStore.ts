import { create } from "zustand"
import { reviewService } from "@/services"
import type { ReviewPoint, ReviewPointFilters, CreateReviewPointData } from "@/types"

interface ReviewState {
  reviewPoints: ReviewPoint[]
  currentReviewPoint: ReviewPoint | null
  total: number
  page: number
  pageSize: number
  filters: ReviewPointFilters
  loading: boolean
  generating: boolean
  reviewedCount: number
  unreviewedCount: number
  fetchReviewPoints: () => Promise<void>
  fetchReviewPoint: (id: string) => Promise<any>
  createReviewPoint: (data: CreateReviewPointData) => Promise<any>
  generateAIAnswer: (question: string, onChunk: (chunk: string) => void) => Promise<any>
  toggleReviewStatus: (id: string, isReviewed: boolean) => Promise<any>
  deleteReviewPoint: (id: string) => Promise<any>
  updateReviewPoint: (id: string, data: any) => Promise<any>
  setFilters: (filters: ReviewPointFilters) => void
  setPage: (page: number) => void
}

// Convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item))
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      )
      acc[camelKey] = toCamelCase(obj[key])
      return acc
    }, {})
  }
  return obj
}

export const useReviewStore = create<ReviewState>()((set, get) => ({
  reviewPoints: [],
  currentReviewPoint: null,
  total: 0,
  page: 1,
  pageSize: 20,
  filters: {},
  loading: false,
  generating: false,
  reviewedCount: 0,
  unreviewedCount: 0,

  fetchReviewPoints: async () => {
    set({ loading: true })
    try {
      const { filters, page, pageSize } = get()
      const response = await reviewService.getReviewPoints(filters, page, pageSize)
      if (response.items) {
        const reviewPoints = toCamelCase(response.items)
        set({
          reviewPoints,
          total: response.total,
          reviewedCount: reviewPoints.filter((rp: ReviewPoint) => rp.isReviewed).length,
          unreviewedCount: reviewPoints.filter((rp: ReviewPoint) => !rp.isReviewed).length,
        })
      }
    } finally {
      set({ loading: false })
    }
  },

  fetchReviewPoint: async (id: string) => {
    set({ loading: true })
    try {
      const response = await reviewService.getReviewPoint(id)
      const point = toCamelCase(response.review_point || response)
      set({ currentReviewPoint: point })
      return { code: 200, data: { reviewPoint: point } }
    } finally {
      set({ loading: false })
    }
  },

  createReviewPoint: async (data: CreateReviewPointData) => {
    set({ loading: true })
    try {
      const response = await reviewService.createReviewPoint(data)
      const newPoint = toCamelCase(response.review_point || response)
      set((state) => ({
        reviewPoints: [newPoint, ...state.reviewPoints],
        total: state.total + 1,
      }))
      return { code: 200, data: { reviewPoint: newPoint } }
    } finally {
      set({ loading: false })
    }
  },

  generateAIAnswer: async (question: string, onChunk: (chunk: string) => void) => {
    set({ generating: true })
    try {
      const answer = await reviewService.generateAIAnswer(question, onChunk)
      return { code: 200, data: { answer } }
    } finally {
      set({ generating: false })
    }
  },

  toggleReviewStatus: async (id: string, isReviewed: boolean) => {
    const response = await reviewService.toggleReviewStatus(id, isReviewed)
    const updatedPoint = toCamelCase(response.review_point || response)
    set((state) => ({
      reviewPoints: state.reviewPoints.map((rp) =>
        rp.id === id ? updatedPoint : rp
      ),
      currentReviewPoint:
        state.currentReviewPoint?.id === id
          ? updatedPoint
          : state.currentReviewPoint,
    }))
    return { code: 200, data: { reviewPoint: updatedPoint } }
  },

  deleteReviewPoint: async (id: string) => {
    await reviewService.deleteReviewPoint(id)
    set((state) => ({
      reviewPoints: state.reviewPoints.filter((rp) => rp.id !== id),
      total: state.total - 1,
      currentReviewPoint:
        state.currentReviewPoint?.id === id ? null : state.currentReviewPoint,
    }))
    return { code: 200 }
  },

  updateReviewPoint: async (id: string, data: any) => {
    set({ loading: true })
    try {
      const response = await reviewService.updateReviewPoint(id, data)
      const updatedPoint = toCamelCase(response.review_point || response)
      set((state) => ({
        reviewPoints: state.reviewPoints.map((rp) =>
          rp.id === id ? updatedPoint : rp
        ),
        currentReviewPoint:
          state.currentReviewPoint?.id === id
            ? updatedPoint
            : state.currentReviewPoint,
      }))
      return { code: 200, data: { reviewPoint: updatedPoint } }
    } finally {
      set({ loading: false })
    }
  },

  setFilters: (filters: ReviewPointFilters) => {
    set({ filters, page: 1 })
    get().fetchReviewPoints()
  },

  setPage: (page: number) => {
    set({ page })
    get().fetchReviewPoints()
  },
}))
