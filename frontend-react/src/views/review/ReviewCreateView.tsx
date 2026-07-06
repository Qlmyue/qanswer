import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, HelpCircle, Edit, Link, Tag, Plus, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useReviewStore } from "@/stores/reviewStore"
import type { AnswerSource } from "@/types"

export function ReviewCreateView() {
  const navigate = useNavigate()
  const { createReviewPoint, loading } = useReviewStore()

  const [form, setForm] = useState({
    question: "",
    answer: "",
    answerSource: "manual_input" as AnswerSource,
    referenceLinks: [] as string[],
    skillTags: [] as string[],
  })

  const [newLink, setNewLink] = useState("")
  const [newTag, setNewTag] = useState("")

  const addLink = () => {
    if (newLink.trim()) {
      setForm({ ...form, referenceLinks: [...form.referenceLinks, newLink.trim()] })
      setNewLink("")
    }
  }

  const removeLink = (index: number) => {
    setForm({
      ...form,
      referenceLinks: form.referenceLinks.filter((_, i) => i !== index),
    })
  }

  const addTag = () => {
    if (newTag.trim() && !form.skillTags.includes(newTag.trim())) {
      setForm({ ...form, skillTags: [...form.skillTags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setForm({ ...form, skillTags: form.skillTags.filter((t) => t !== tag) })
  }

  const handleSave = async () => {
    if (!form.question.trim()) {
      alert("请输入问题")
      return
    }

    const response = await createReviewPoint({
      question: form.question,
      answer: form.answer || undefined,
      answerSource: form.answer ? form.answerSource : "ai_generated",
      referenceLinks: form.referenceLinks,
      skillTags: form.skillTags,
    })

    if (response?.code === 200) {
      navigate(`/review/${response.data.reviewPoint.id}`)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button variant="ghost" onClick={() => navigate("/review")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
        <h1 className="text-2xl font-bold text-foreground">创建复盘点</h1>
        <div className="w-[120px]" />
      </motion.div>

      {/* Question input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">面试问题</h3>
                <p className="text-sm text-muted-foreground">输入面试官提出的问题</p>
              </div>
            </div>
            <Textarea
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="请输入面试官提出的问题..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Answer input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Edit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">答案（可选）</h3>
                <p className="text-sm text-muted-foreground">可手动填写答案，留空则自动生成AI答案</p>
              </div>
            </div>
            <Textarea
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="请输入答案内容（可选），留空将自动生成AI答案..."
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Reference links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Link className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">参考链接</h3>
                <p className="text-sm text-muted-foreground">添加相关参考资料链接</p>
              </div>
            </div>
            <div className="mb-3 flex gap-2">
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="输入参考链接URL"
                onKeyDown={(e) => e.key === "Enter" && addLink()}
              />
              <Button onClick={addLink}>
                <Plus className="mr-2 h-4 w-4" />
                添加
              </Button>
            </div>
            <div className="space-y-2">
              {form.referenceLinks.map((link, index) => (
                <motion.div
                  key={link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-primary/5"
                >
                  <Link className="h-4 w-4 flex-shrink-0 text-primary" />
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener"
                    className="flex-1 truncate text-sm text-primary hover:underline"
                  >
                    {link}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeLink(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skill tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">技能标签</h3>
                <p className="text-sm text-muted-foreground">添加相关技能标签便于分类</p>
              </div>
            </div>
            <div className="mb-3 flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="输入技能标签"
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <Button onClick={addTag}>
                <Plus className="mr-2 h-4 w-4" />
                添加
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skillTags.map((tag) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-1 h-4 w-4 hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end gap-3 pb-6"
      >
        <Button variant="outline" size="lg" onClick={() => navigate("/review")}>
          取消
        </Button>
        <Button size="lg" onClick={handleSave} disabled={loading}>
          <Check className="mr-2 h-4 w-4" />
          {loading ? "保存中..." : "保存复盘点"}
        </Button>
      </motion.div>
    </div>
  )
}
