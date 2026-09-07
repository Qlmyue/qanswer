import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useReviewStore } from "@/stores/reviewStore"
import { RichTextEditor } from "@/components/common/RichTextEditor"

export function ReviewEditView() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { currentReviewPoint, fetchReviewPoint, updateReviewPoint, loading } = useReviewStore()

  const [form, setForm] = useState({
    question: "",
    answer: "",
    referenceLinks: [] as string[],
    skillTags: [] as string[],
  })

  const [newLink, setNewLink] = useState("")
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (id) {
      fetchReviewPoint(id)
    }
  }, [id])

  useEffect(() => {
    if (currentReviewPoint) {
      setForm({
        question: currentReviewPoint.question,
        answer: currentReviewPoint.answer,
        referenceLinks: [...currentReviewPoint.referenceLinks],
        skillTags: [...currentReviewPoint.skillTags],
      })
    }
  }, [currentReviewPoint])

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
    if (!form.answer.trim()) {
      alert("请输入答案")
      return
    }

    const response = await updateReviewPoint(id!, {
      question: form.question,
      answer: form.answer,
      referenceLinks: form.referenceLinks,
      skillTags: form.skillTags,
    })

    if (response?.code === 200) {
      navigate(`/review/${id}`)
    }
  }

  if (loading && !currentReviewPoint) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button variant="ghost" onClick={() => navigate(`/review/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回详情
        </Button>
        <h1 className="text-2xl font-bold text-foreground">编辑复盘点</h1>
        <div className="w-[120px]" />
      </motion.div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>面试问题</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="请输入面试问题..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Answer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>答案</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={form.answer}
              onChange={(answer) => setForm((current) => ({ ...current, answer }))}
              placeholder="请输入答案内容，使用工具栏让表达更清晰…"
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
        <Card>
          <CardHeader>
            <CardTitle>参考链接</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex gap-2">
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="输入参考链接URL"
                onKeyDown={(e) => e.key === "Enter" && addLink()}
              />
              <Button onClick={addLink}>添加</Button>
            </div>
            <div className="space-y-2">
              {form.referenceLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between rounded-xl bg-muted p-3">
                  <a href={link} target="_blank" rel="noopener" className="truncate text-sm text-primary hover:underline">
                    {link}
                  </a>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeLink(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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
        <Card>
          <CardHeader>
            <CardTitle>技能标签</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="输入技能标签"
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <Button onClick={addTag}>添加</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skillTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 hover:text-destructive" onClick={() => removeTag(tag)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
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
        <Button variant="outline" size="lg" onClick={() => navigate(`/review/${id}`)}>
          取消
        </Button>
        <Button size="lg" onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "保存中..." : "保存修改"}
        </Button>
      </motion.div>
    </div>
  )
}
