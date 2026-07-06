import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Eye,
  CheckCircle,
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Search,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useReviewStore } from "@/stores/reviewStore"
import { formatRelativeTime } from "@/utils/date"

export function ReviewListView() {
  const navigate = useNavigate()
  const {
    reviewPoints,
    total,
    page,
    pageSize,
    loading,
    filters,
    fetchReviewPoints,
    setFilters,
    setPage,
    toggleReviewStatus,
    deleteReviewPoint,
  } = useReviewStore()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState("")

  useEffect(() => {
    fetchReviewPoints()
  }, [])

  const handleSearch = () => {
    setFilters({ ...filters, keyword: searchKeyword })
  }

  const handleToggleReview = async (id: string, currentStatus: boolean) => {
    await toggleReviewStatus(id, !currentStatus)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("确定要删除这个复盘点吗？此操作不可恢复。")) {
      await deleteReviewPoint(id)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">复盘点管理</h1>
          <p className="text-muted-foreground">管理你的面试问答，随时复习巩固</p>
        </div>
        <Button size="lg" onClick={() => navigate("/review/create")}>
          <Plus className="mr-2 h-5 w-5" />
          新建复盘点
        </Button>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索复盘点..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-11 pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleSearch}>
          搜索
        </Button>
      </motion.div>

      {/* Batch actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    已选择 <strong>{selectedIds.length}</strong> 项
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    批量标记已复盘
                  </Button>
                  <Button size="sm" variant="outline">
                    批量导出
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review points list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                暂无复盘点
              </h3>
              <p className="mb-6 text-muted-foreground">
                点击下方按钮创建你的第一个复盘点
              </p>
              <Button onClick={() => navigate("/review/create")}>
                <Plus className="mr-2 h-4 w-4" />
                创建复盘点
              </Button>
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
                <div className="flex-1 text-sm font-medium text-muted-foreground">
                  问题
                </div>
                <div className="w-20 text-center text-sm font-medium text-muted-foreground">
                  来源
                </div>
                <div className="w-20 text-center text-sm font-medium text-muted-foreground">
                  状态
                </div>
                <div className="w-24 text-center text-sm font-medium text-muted-foreground">
                  创建时间
                </div>
                <div className="w-32 text-center text-sm font-medium text-muted-foreground">
                  操作
                </div>
              </div>

              {/* Table rows */}
              {reviewPoints.map((rp) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-center px-4 py-4 transition-colors hover:bg-muted/50 ${
                    rp.isReviewed ? "bg-emerald-50/50" : ""
                  }`}
                >
                  <div className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rp.id)}
                      onChange={() => handleSelectionChange(rp.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() => navigate(`/review/${rp.id}`)}
                      className="mb-2 text-left text-sm font-medium text-foreground hover:text-primary"
                    >
                      {rp.question}
                    </button>
                    <div className="flex flex-wrap gap-1">
                      {rp.skillTags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(rp.skillTags?.length || 0) > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{(rp.skillTags?.length || 0) - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-20 text-center">
                    <Badge
                      variant={
                        rp.answerSource === "ai_generated" ? "default" : "success"
                      }
                    >
                      {rp.answerSource === "ai_generated" ? "AI" : "手动"}
                    </Badge>
                  </div>
                  <div className="w-20 text-center">
                    <Badge variant={rp.isReviewed ? "success" : "secondary"}>
                      {rp.isReviewed ? "已复盘" : "未复盘"}
                    </Badge>
                  </div>
                  <div className="w-24 text-center text-xs text-muted-foreground">
                    {formatRelativeTime(rp.createdAt)}
                  </div>
                  <div className="w-32">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => navigate(`/review/${rp.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${
                          rp.isReviewed
                            ? "text-muted-foreground"
                            : "text-emerald-500"
                        }`}
                        onClick={() =>
                          handleToggleReview(rp.id, rp.isReviewed)
                        }
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              /* Export logic */
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            导出MD
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/review/${rp.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(rp.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Pagination */}
      {total > pageSize && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              上一页
            </Button>
            <span className="text-sm text-muted-foreground">
              第 {page} 页，共 {Math.ceil(total / pageSize)} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(page + 1)}
            >
              下一页
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
