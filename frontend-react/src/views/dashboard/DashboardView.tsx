import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  FileText,
  CheckCircle,
  BarChart3,
  PenLine,
  Plus,
  Calendar,
  Trophy,
  ArrowRight,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/common/StatsCard"
import { dashboardService } from "@/services"
import type { DashboardData } from "@/types"
import { formatRelativeTime } from "@/utils/date"

export function DashboardView() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getDashboardData()
        setDashboardData(response)
      } catch (error) {
        console.error("Dashboard error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatRate = (rate: number) => Math.round(rate * 100) + "%"

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-primary rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">欢迎回来 👋</h1>
            <p className="text-lg opacity-90">
              继续你的面试准备之旅，每天进步一点点
            </p>
          </div>
          <Button
            size="lg"
            className="h-12 bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/review")}
          >
            <Plus className="mr-2 h-5 w-5" />
            新建复盘点
          </Button>
        </div>
      </motion.div>

      {/* Stats cards */}
      {dashboardData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatsCard
            title="总复盘点"
            value={dashboardData.stats.totalReviewPoints}
            icon={FileText}
            color="#6366f1"
          />
          <StatsCard
            title="已复盘"
            value={dashboardData.stats.reviewedPoints}
            icon={CheckCircle}
            color="#10b981"
          />
          <StatsCard
            title="复盘率"
            value={formatRate(dashboardData.stats.reviewRate)}
            icon={BarChart3}
            color="#f59e0b"
          />
          <StatsCard
            title="练习题数"
            value={dashboardData.stats.totalPracticeQuestions}
            icon={PenLine}
            color="#ef4444"
          />
        </motion.div>
      )}

      {/* Today's tasks */}
      {dashboardData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            今日任务
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Daily Challenge */}
            <Card
              className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              onClick={() => navigate("/challenge")}
            >
              <CardContent className="flex items-center gap-5 p-6">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Trophy className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-foreground">
                    每日考核
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    从复盘点中随机抽取问题，检验学习成果
                  </p>
                  <div className="flex items-center gap-2">
                    {dashboardData.todayChallenge ? (
                      <>
                        <Badge
                          variant={
                            dashboardData.todayChallenge.isCompleted
                              ? "success"
                              : "warning"
                          }
                        >
                          {dashboardData.todayChallenge.isCompleted
                            ? "已完成"
                            : "待完成"}
                        </Badge>
                        <span className="truncate text-xs text-muted-foreground">
                          {dashboardData.todayChallenge.questionPreview}
                        </span>
                      </>
                    ) : (
                      <Badge variant="secondary">暂无任务</Badge>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>

            {/* Daily Practice */}
            <Card
              className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              onClick={() => navigate("/practice")}
            >
              <CardContent className="flex items-center gap-5 p-6">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PenLine className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-foreground">
                    每日练习
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    每天一道新的面试题，扩展知识面
                  </p>
                  <div className="flex items-center gap-2">
                    {dashboardData.todayPractice ? (
                      <>
                        <Badge
                          variant={
                            dashboardData.todayPractice.isAnswered
                              ? "success"
                              : "default"
                          }
                        >
                          {dashboardData.todayPractice.isAnswered
                            ? "已回答"
                            : "待回答"}
                        </Badge>
                        <span className="truncate text-xs text-muted-foreground">
                          {dashboardData.todayPractice.questionPreview}
                        </span>
                      </>
                    ) : (
                      <Badge variant="secondary">暂无任务</Badge>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Recent review points */}
      {dashboardData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              最近复盘点
            </h2>
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/review")}
            >
              查看全部
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <Card className="overflow-hidden">
            <div className="divide-y">
              {dashboardData.recentReviewPoints.map((rp) => (
                <div
                  key={rp.id}
                  className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted"
                  onClick={() => navigate(`/review/${rp.id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 truncate text-sm font-medium text-foreground">
                      {rp.question}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(rp.createdAt)}
                    </span>
                  </div>
                  <Badge
                    variant={rp.isReviewed ? "success" : "secondary"}
                    className="ml-4"
                  >
                    {rp.isReviewed ? "已复盘" : "未复盘"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !dashboardData && (
        <Card className="py-20 text-center">
          <CardContent>
            <p className="mb-4 text-muted-foreground">暂无数据，请先创建复盘点</p>
            <Button onClick={() => navigate("/review/create")}>
              <Plus className="mr-2 h-4 w-4" />
              创建复盘点
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
