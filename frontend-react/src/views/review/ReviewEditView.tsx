import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Check, Link2, Maximize2, Minimize2, Save, Tags, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  // 问题悬浮卡片是否展开
  const [questionOpen, setQuestionOpen] = useState(true)
  // 标签 / 链接面板是否展开
  const [panelOpen, setPanelOpen] = useState(false)

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
    <div className="flex h-[calc(100vh-88px)] flex-col">
      {/* 顶部工具栏 */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:gap-3 md:px-2">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate(`/review/${id}`)} title="返回详情">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-bold text-foreground md:text-lg">编辑复盘点</h1>

        {form.skillTags.length > 0 && (
          <div className="ml-2 hidden max-w-[220px] items-center gap-1.5 overflow-hidden sm:flex">
            {form.skillTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="whitespace-nowrap">
                {tag}
              </Badge>
            ))}
            {form.skillTags.length > 3 && (
              <span className="shrink-0 text-xs text-muted-foreground">+{form.skillTags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex-1" />

        <Button variant="outline" className="rounded-xl" onClick={() => setPanelOpen((v) => !v)}>
          <Tags className="mr-1.5 h-4 w-4" />
          标签 / 链接
        </Button>
        <Button className="rounded-xl" onClick={handleSave} disabled={loading}>
          <Save className="mr-1.5 h-4 w-4" />
          {loading ? "保存中..." : "保存"}
        </Button>
      </header>

      {/* 答案编辑区（占满可视高度，保留左侧菜单） */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <RichTextEditor
          fullscreen
          content={form.answer}
          onChange={(answer) => setForm((c) => ({ ...c, answer }))}
          placeholder="开始写下你的答案…"
        />

        {/* 悬浮问题卡片（右下角） */}
        <div className="pointer-events-none absolute bottom-5 right-4 z-10 md:bottom-8 md:right-8">
          <AnimatePresence mode="wait" initial={false}>
            {questionOpen ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className="pointer-events-auto w-[300px] overflow-hidden rounded-2xl border border-border bg-popover/90 shadow-2xl shadow-black/10 backdrop-blur-xl md:w-[340px]"
              >
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">面试问题</span>
                  <button
                    type="button"
                    aria-label="收起问题"
                    className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    onClick={() => setQuestionOpen(false)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3.5">
                  <Textarea
                    value={form.question}
                    onChange={(e) => setForm((c) => ({ ...c, question: e.target.value }))}
                    placeholder="请输入面试问题..."
                    className="min-h-[96px] border-transparent bg-transparent shadow-none !p-0 focus-visible:ring-0"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="collapsed"
                type="button"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                onClick={() => setQuestionOpen(true)}
                className="pointer-events-auto flex max-w-[280px] items-center gap-2 rounded-2xl border border-border bg-popover/90 px-3.5 py-2.5 text-left shadow-2xl shadow-black/10 backdrop-blur-xl transition hover:border-primary/40"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
                <span className="truncate text-sm font-medium text-foreground">
                  {form.question.trim() || "点击查看 / 编辑问题"}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 标签 / 链接 面板 */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-3 top-16 z-20 w-[340px] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl shadow-black/10 backdrop-blur-xl md:right-6"
          >
            {/* 参考链接 */}
            <div className="px-4 pb-1 pt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">参考链接</p>
              <div className="mb-2 flex gap-2">
                <Input
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="输入参考链接 URL"
                  onKeyDown={(e) => e.key === "Enter" && addLink()}
                  className="h-9 text-xs"
                />
                <Button size="sm" className="h-9 px-3" onClick={addLink}>
                  添加
                </Button>
              </div>
              <div className="max-h-32 space-y-1.5 overflow-y-auto pr-1">
                {form.referenceLinks.map((link, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between gap-2 rounded-lg bg-muted px-2.5 py-1.5"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center gap-1.5 truncate text-xs text-primary hover:underline"
                    >
                      <Link2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{link}</span>
                    </a>
                    <button
                      type="button"
                      aria-label="移除链接"
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                      onClick={() => removeLink(index)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 技能标签 */}
            <div className="px-4 pb-4 pt-3">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">技能标签</p>
              <div className="mb-2 flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="输入技能标签"
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  className="h-9 text-xs"
                />
                <Button size="sm" className="h-9 px-3" onClick={addTag}>
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.skillTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 py-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      aria-label={`移除标签 ${tag}`}
                      className="grid h-3.5 w-3.5 place-items-center rounded-full transition hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {form.skillTags.length === 0 && (
                  <span className="text-xs text-muted-foreground">暂无标签，可点击上方添加</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-border/70 px-4 py-2.5">
              <Button size="sm" variant="ghost" className="h-8" onClick={() => setPanelOpen(false)}>
                <Check className="mr-1 h-3.5 w-3.5" />
                完成
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
