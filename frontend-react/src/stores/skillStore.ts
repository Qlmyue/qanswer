import { create } from "zustand"
import { skillService } from "@/services"
import type { SkillItem, CreateSkillData } from "@/types"

interface SkillState {
  skills: SkillItem[]
  loading: boolean
  fetchSkills: (filters?: { category?: string; priority?: string }) => Promise<void>
  createSkill: (data: CreateSkillData) => Promise<any>
  updateSkill: (id: string, data: Partial<CreateSkillData>) => Promise<any>
  deleteSkill: (id: string) => Promise<any>
}

export const useSkillStore = create<SkillState>()((set) => ({
  skills: [],
  loading: false,

  fetchSkills: async (filters) => {
    set({ loading: true })
    try {
      const response = await skillService.getSkills(filters)
      set({ skills: response.items || response })
    } finally {
      set({ loading: false })
    }
  },

  createSkill: async (data) => {
    set({ loading: true })
    try {
      const response = await skillService.createSkill(data)
      set((state) => ({
        skills: [...state.skills, response.skill || response],
      }))
      return { code: 200 }
    } finally {
      set({ loading: false })
    }
  },

  updateSkill: async (id, data) => {
    set({ loading: true })
    try {
      const response = await skillService.updateSkill(id, data)
      const updatedSkill = response.skill || response
      set((state) => ({
        skills: state.skills.map((s) => (s.id === id ? updatedSkill : s)),
      }))
      return { code: 200 }
    } finally {
      set({ loading: false })
    }
  },

  deleteSkill: async (id) => {
    set({ loading: true })
    try {
      await skillService.deleteSkill(id)
      set((state) => ({
        skills: state.skills.filter((s) => s.id !== id),
      }))
      return { code: 200 }
    } finally {
      set({ loading: false })
    }
  },
}))
