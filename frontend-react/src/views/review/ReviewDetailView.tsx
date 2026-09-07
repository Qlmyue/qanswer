import { useEffect } from "react"
import DOMPurify from "dompurify"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Download,
  Edit,
  CheckCircle,
  Trash2,
  HelpCircle,
  FileText,
  Link,
  Clock,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useReviewStore } from "@/stores/reviewStore"
import { formatDateTime } from "@/utils/date"

export function ReviewDetailView() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const {
    currentReviewPoint,
    fetchReviewPoint,
    toggleReviewStatus,
    deleteReviewPoint,
    loading,
  } = useReviewStore()

  useEffect(() => {
    if (id) {
      fetchReviewPoint(id)
    }
  }, [id])

  const handleToggleReview = async () => {
    if (!currentReviewPoint) return
    const newStatus = !currentReviewPoint.isReviewed
    await toggleReviewStatus(id!, newStatus)
  }

  const handleDelete = async () => {
    if (window.confirm("确定要删除这个复盘点吗？此操作不可恢复。")) {
      await deleteReviewPoint(id!)
      navigate("/review")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (!currentReviewPoint) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">复盘点不存在</p>
      </div>
    )
  }

  const renderedAnswer = DOMPurify.sanitize(
    currentReviewPoint.answer.includes("<")
      ? currentReviewPoint.answer
      : currentReviewPoint.answer.replace(/\n/g, "<br />")
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button variant="ghost" onClick={() => navigate("/review")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            导出MD
          </Button>
          <Button variant="outline" onClick={() => navigate(`/review/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            编辑
          </Button>
          <Button
            variant={currentReviewPoint.isReviewed ? "secondary" : "default"}
            onClick={handleToggleReview}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {currentReviewPoint.isReviewed ? "取消复盘" : "标记复盘"}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </Button>
        </div>
      </motion.div>

      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="h-7 w-7" />
              </div>
              <div className="flex gap-2">
                <Badge variant={currentReviewPoint.answerSource === "ai_generated" ? "default" : "success"}>
                  {currentReviewPoint.answerSource === "ai_generated" ? "AI生成" : "手动输入"}
                </Badge>
                <Badge variant={currentReviewPoint.isReviewed ? "success" : "warning"}>
                  {currentReviewPoint.isReviewed ? "已复盘" : "未复盘"}
                </Badge>
              </div>
            </div>
            <h1 className="mb-4 text-2xl font-semibold text-foreground">
              {currentReviewPoint.question}
            </h1>
            <div className="flex gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                创建于 {formatDateTime(currentReviewPoint.createdAt)}
              </span>
              {currentReviewPoint.reviewedAt && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  复盘于 {formatDateTime(currentReviewPoint.reviewedAt)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skill tags */}
      {currentReviewPoint.skillTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <span className="text-sm font-medium text-muted-foreground">技能标签</span>
          <div className="flex flex-wrap gap-2">
            {currentReviewPoint.skillTags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Answer card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-4 border-b pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">答案</h2>
            </div>
            <div className="rich-text-content min-h-0 p-0" dangerouslySetInnerHTML={{ __html: renderedAnswer }} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Reference links */}
      {currentReviewPoint.referenceLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-4 border-b pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Link className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">参考资料</h2>
              </div>
              <div className="space-y-3">
                {currentReviewPoint.referenceLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-4 rounded-xl bg-muted p-4 transition-all hover:bg-primary/5 hover:translate-x-1"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <span className="flex-1 truncate text-sm text-foreground">{link}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
