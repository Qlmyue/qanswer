import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { List, Plus, Edit, Trash2, Cpu, Monitor, Cloud, Code, User, MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSkillStore } from "@/stores/skillStore"
import type { SkillItem, SkillPriority } from "@/types"
import { SKILL_CATEGORIES } from "@/types"

export function SkillView() {
  const { skills, loading, fetchSkills, createSkill, updateSkill, deleteSkill } = useSkillStore()

  const [filterCategory, setFilterCategory] = useState("")
  const [filterPriority, setFilterPriority] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null)

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    priority: "medium" as SkillPriority,
    boundary: "",
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleFilterChange = () => {
    fetchSkills({
      category: filterCategory || undefined,
      priority: (filterPriority as SkillPriority) || undefined,
    })
  }

  useEffect(() => {
    handleFilterChange()
  }, [filterCategory, filterPriority])

  const openCreateDialog = () => {
    setEditingSkill(null)
    setForm({ name: "", description: "", category: "", priority: "medium", boundary: "" })
    setDialogOpen(true)
  }

  const openEditDialog = (skill: SkillItem) => {
    setEditingSkill(skill)
    setForm({
      name: skill.name,
      description: skill.description || "",
      category: skill.category,
      priority: skill.priority,
      boundary: skill.boundary || "",
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("请输入技能名称")
      return
    }
    if (!form.category) {
      alert("请选择技能分类")
      return
    }

    if (editingSkill) {
      await updateSkill(editingSkill.id, form)
    } else {
      await createSkill(form)
    }
    setDialogOpen(false)
  }

  const handleDelete = async (skill: SkillItem) => {
    if (window.confirm(`确定要删除技能"${skill.name}"吗？`)) {
      await deleteSkill(skill.id)
    }
  }

  const getPriorityColor = (priority: SkillPriority) => {
    const map: Record<SkillPriority, "destructive" | "warning" | "secondary"> = {
      high: "destructive",
      medium: "warning",
      low: "secondary",
    }
    return map[priority]
  }

  const getPriorityLabel = (priority: SkillPriority) => {
    const map: Record<SkillPriority, string> = { high: "高", medium: "中", low: "低" }
    return map[priority]
  }

  const getCategoryIcon = (category: string) => {
    const map: Record<string, React.ElementType> = {
      "AI/ML框架": Cpu,
      "后端开发": Monitor,
      "数据库": Code,
      "云服务": Cloud,
      "DevOps": Monitor,
      "编程语言": Code,
      "软技能": User,
      "其他": MoreHorizontal,
    }
    const Icon = map[category] || MoreHorizontal
    return <Icon className="h-6 w-6" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <List className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">技能管理</h1>
            <p className="text-muted-foreground">定义和管理你的必备技能清单</p>
          </div>
        </div>
        <Button size="lg" onClick={openCreateDialog}>
          <Plus className="mr-2 h-5 w-5" />
          添加技能
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3"
      >
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="按分类筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {SKILL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="按优先级筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部优先级</SelectItem>
            <SelectItem value="high">高优先级</SelectItem>
            <SelectItem value="medium">中优先级</SelectItem>
            <SelectItem value="low">低优先级</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Skills grid */}
      {!loading && skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {getCategoryIcon(skill.category)}
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(skill)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(skill)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-foreground">{skill.name}</h3>

                  <div className="mb-3 flex gap-2">
                    <Badge variant={getPriorityColor(skill.priority)}>
                      {getPriorityLabel(skill.priority)}优先级
                    </Badge>
                    <Badge variant="outline">{skill.category}</Badge>
                  </div>

                  {skill.description && (
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{skill.description}</p>
                  )}

                  {skill.boundary && (
                    <div className="border-t pt-3">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">边界说明</span>
                      <p className="text-sm text-foreground line-clamp-3">{skill.boundary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && skills.length === 0 && (
        <Card className="py-20 text-center">
          <CardContent>
            <List className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">暂无技能</h3>
            <p className="mb-6 text-muted-foreground">点击下方按钮添加你的第一个技能</p>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              添加技能
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSkill ? "编辑技能" : "添加技能"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>技能名称 *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="请输入技能名称"
              />
            </div>
            <div className="space-y-2">
              <Label>分类 *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>优先级 *</Label>
              <div className="flex gap-2">
                {(["high", "medium", "low"] as SkillPriority[]).map((p) => (
                  <Button
                    key={p}
                    variant={form.priority === p ? "default" : "outline"}
                    onClick={() => setForm({ ...form, priority: p })}
                  >
                    {getPriorityLabel(p)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>描述</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="请输入技能描述"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>边界说明</Label>
              <Textarea
                value={form.boundary}
                onChange={(e) => setForm({ ...form, boundary: e.target.value })}
                placeholder="请描述该技能的范围和深度要求"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
