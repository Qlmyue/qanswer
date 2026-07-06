import type { SkillItem, CreateSkillData } from "@/types"

const mockSkills: SkillItem[] = [
  {
    id: "1",
    name: "React",
    description: "现代前端框架，用于构建用户界面",
    category: "AI/ML框架",
    priority: "high",
    boundary: "掌握 JSX、Hooks、Context、React Router 等核心概念",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "TypeScript",
    description: "JavaScript 的超集，添加了类型系统",
    category: "编程语言",
    priority: "high",
    boundary: "掌握基础类型、接口、泛型、类型守卫等",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Node.js",
    description: "基于 Chrome V8 引擎的 JavaScript 运行时",
    category: "后端开发",
    priority: "medium",
    boundary: "掌握 Express/Koa 框架、中间件、路由等",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let nextId = 4

export const skillService = {
  async getSkills(filters?: { category?: string; priority?: string }): Promise<{ items: SkillItem[] }> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filtered = [...mockSkills]

    if (filters?.category) {
      filtered = filtered.filter((s) => s.category === filters.category)
    }
    if (filters?.priority) {
      filtered = filtered.filter((s) => s.priority === filters.priority)
    }

    return { items: filtered }
  },

  async createSkill(data: CreateSkillData): Promise<{ skill: SkillItem }> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const newSkill: SkillItem = {
      id: String(nextId++),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockSkills.push(newSkill)
    return { skill: newSkill }
  },

  async updateSkill(id: string, data: Partial<CreateSkillData>): Promise<{ skill: SkillItem }> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const index = mockSkills.findIndex((s) => s.id === id)
    if (index === -1) throw new Error("Skill not found")

    mockSkills[index] = {
      ...mockSkills[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return { skill: mockSkills[index] }
  },

  async deleteSkill(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = mockSkills.findIndex((s) => s.id === id)
    if (index === -1) throw new Error("Skill not found")

    mockSkills.splice(index, 1)
  },
}
