import { create } from "zustand"
import { challengeService } from "@/services"
import type { DailyChallenge } from "@/types"

interface ChallengeState {
  todayChallenge: DailyChallenge | null
  loading: boolean
  submitting: boolean
  isCompleted: boolean
  hasReviewPoints: boolean
  fetchTodayChallenge: () => Promise<void>
  completeChallenge: (answer: string) => Promise<any>
}

export const useChallengeStore = create<ChallengeState>()((set, get) => ({
  todayChallenge: null,
  loading: false,
  submitting: false,
  isCompleted: false,
  hasReviewPoints: true,

  fetchTodayChallenge: async () => {
    set({ loading: true })
    try {
      const response = await challengeService.getTodayChallenge()
      if (response) {
        set({
          todayChallenge: response,
          isCompleted: response.isCompleted,
          hasReviewPoints: true,
        })
      } else {
        set({ hasReviewPoints: false })
      }
    } catch (error) {
      set({ hasReviewPoints: false })
    } finally {
      set({ loading: false })
    }
  },

  completeChallenge: async (answer: string) => {
    set({ submitting: true })
    try {
      const { todayChallenge } = get()
      if (!todayChallenge) return null

      const response = await challengeService.completeChallenge(todayChallenge.id, answer)
      set({
        todayChallenge: { ...todayChallenge, userAnswer: answer, isCompleted: true },
        isCompleted: true,
      })
      return { code: 200 }
    } finally {
      set({ submitting: false })
    }
  },
}))
