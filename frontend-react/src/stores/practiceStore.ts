import { create } from "zustand"
import { practiceService } from "@/services"
import type { PracticeQuestion } from "@/types"

interface PracticeState {
  todayPractice: PracticeQuestion | null
  loading: boolean
  submitting: boolean
  fetchTodayPractice: () => Promise<void>
  submitAnswer: (answer: string) => Promise<any>
}

export const usePracticeStore = create<PracticeState>()((set, get) => ({
  todayPractice: null,
  loading: false,
  submitting: false,

  fetchTodayPractice: async () => {
    set({ loading: true })
    try {
      const response = await practiceService.getTodayPractice()
      set({ todayPractice: response })
    } finally {
      set({ loading: false })
    }
  },

  submitAnswer: async (answer: string) => {
    const { todayPractice } = get()
    if (!todayPractice) return null

    set({ submitting: true })
    try {
      const response = await practiceService.submitAnswer(todayPractice.id, answer)
      set({ todayPractice: response })
      return { code: 200 }
    } finally {
      set({ submitting: false })
    }
  },
}))
