import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Download, FolderDown, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { reviewService } from "@/services"
import { exportReviewPoint, exportMultipleReviewPoints } from "@/utils/export"
import type { ReviewPoint } from "@/types"

export function ExportView() {
  const [loading, setLoading] = useState(false)
  const [reviewPoints, setReviewPoints] = useState<ReviewPoint[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  // Convert snake_case to camelCase
  const toCamelCase = (obj: any): any => {
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

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await reviewService.getReviewPoints({}, 1, 100)
      if (response.items) {
        setReviewPoints(toCamelCase(response.items))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSelectionChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === reviewPoints.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(reviewPoints.map((rp) => rp.id))
    }
  }

  const handleExportSingle = (reviewPoint: ReviewPoint) => {
    exportReviewPoint(reviewPoint)
    alert("导出成功")
  }

  const handleBatchExport = () => {
    const selected = reviewPoints.filter((rp) => selectedIds.includes(rp.id))
    if (selected.length === 0) {
      alert("请先选择要导出的复盘点")
      return
    }
    exportMultipleReviewPoints(selected)
    alert(`正在导出 ${selected.length} 个复盘点`)
  }

  const handleExportAll = () => {
    if (reviewPoints.length === 0) {
      alert("暂无复盘点可导出")
      return
    }
    exportMultipleReviewPoints(reviewPoints)
    alert(`正在导出全部 ${reviewPoints.length} 个复盘点`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">数据导出</h1>
      </motion.div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="flex items-start gap-4 p-6">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
            <div className="space-y-1 text-sm text-foreground">
              <p>• 单个导出：点击列表中的"导出"按钮</p>
              <p>• 批量导出：勾选多个复盘点后点击"批量导出"按钮</p>
              <p>• 全部导出：点击"导出全部"按钮导出所有复盘点</p>
              <p>• 导出格式为Markdown文件，包含问题、答案和参考链接</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3"
      >
        <Button onClick={handleBatchExport} disabled={selectedIds.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          批量导出 ({selectedIds.length})
        </Button>
        <Button variant="outline" onClick={handleExportAll}>
          <FolderDown className="mr-2 h-4 w-4" />
          导出全部
        </Button>
      </motion.div>

      {/* Review points list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">加载中...</p>
            </div>
          ) : reviewPoints.length === 0 ? (
            <div className="py-20 text-center">
              <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground">暂无复盘点</p>
            </div>
          ) : (
            <div className="divide-y">
              {/* Table header */}
              <div className="flex items-center bg-muted/50 px-4 py-3">
                <div className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === reviewPoints.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div className="flex-1 text-sm font-medium text-muted-foreground">问题</div>
                <div className="w-24 text-center text-sm font-medium text-muted-foreground">答案来源</div>
                <div className="w-24 text-center text-sm font-medium text-muted-foreground">复盘状态</div>
                <div className="w-20 text-center text-sm font-medium text-muted-foreground">操作</div>
              </div>

              {/* Table rows */}
              {reviewPoints.map((rp) => (
                <div key={rp.id} className="flex items-center px-4 py-4 transition-colors hover:bg-muted/50">
                  <div className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rp.id)}
                      onChange={() => handleSelectionChange(rp.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1 truncate text-sm text-foreground">{rp.question}</div>
                  <div className="w-24 text-center">
                    <Badge variant={rp.answerSource === "ai_generated" ? "default" : "success"}>
                      {rp.answerSource === "ai_generated" ? "AI生成" : "手动输入"}
                    </Badge>
                  </div>
                  <div className="w-24 text-center">
                    <Badge variant={rp.isReviewed ? "success" : "secondary"}>
                      {rp.isReviewed ? "已复盘" : "未复盘"}
                    </Badge>
                  </div>
                  <div className="w-20 text-center">
                    <Button variant="link" size="sm" onClick={() => handleExportSingle(rp)}>
                      导出
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
