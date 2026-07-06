import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  FileText,
  PenLine,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { reportService } from "@/services"
import type { WeeklyReport } from "@/types"

export function AnalysisView() {
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => {
    fetchReport()
  }, [weekOffset])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const response = await reportService.getWeeklyReport(weekOffset)
      if (response.code === 200) {
        setReport(response.data.report)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePrevWeek = () => setWeekOffset(weekOffset + 1)
  const handleNextWeek = () => {
    if (weekOffset > 0) setWeekOffset(weekOffset - 1)
  }

  const formatChange = (change: number) => {
    const prefix = change > 0 ? "+" : ""
    return `${prefix}${change}`
  }

  const getChangeType = (change: number): "success" | "destructive" | "secondary" => {
    if (change > 0) return "success"
    if (change < 0) return "destructive"
    return "secondary"
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
            <BarChart3 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">周度分析</h1>
            <p className="text-muted-foreground">深入了解你的学习进度和薄弱环节</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handlePrevWeek}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            上一周
          </Button>
          {report && (
            <span className="rounded-xl bg-muted px-4 py-2 text-sm font-medium text-foreground">
              {report.weekStart} ~ {report.weekEnd}
            </span>
          )}
          <Button variant="outline" disabled={weekOffset === 0} onClick={handleNextWeek}>
            下一周
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      )}

      {/* Report content */}
      {!loading && report && (
        <>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">新增复盘点</p>
                  <p className="text-2xl font-bold text-foreground">{report.totalReviewPoints}</p>
                </div>
                <Badge variant={getChangeType(report.trendComparison.reviewPointsChange)}>
                  {formatChange(report.trendComparison.reviewPointsChange)}
                </Badge>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <PenLine className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">练习题数</p>
                  <p className="text-2xl font-bold text-foreground">{report.totalPracticeQuestions}</p>
                </div>
                <Badge variant={getChangeType(report.trendComparison.practiceQuestionsChange)}>
                  {formatChange(report.trendComparison.practiceQuestionsChange)}
                </Badge>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">复盘率变化</p>
                  <p className="text-2xl font-bold text-foreground">
                    {report.trendComparison.reviewRateChange > 0 ? "+" : ""}
                    {Math.round(report.trendComparison.reviewRateChange * 100)}%
                  </p>
                </div>
                <Badge variant="secondary">趋势</Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">技能分类统计</h2>
                </div>
                <div className="space-y-5">
                  {Object.entries(report.categoryStats).map(([category, stat]) => (
                    <div key={category}>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm font-medium text-foreground">{category}</span>
                        <span className="text-sm text-muted-foreground">{stat.reviewed}/{stat.total}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.total > 0 ? (stat.reviewed / stat.total) * 100 : 0}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Weak points */}
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">薄弱点识别</h2>
                </div>
                <ul className="space-y-4">
                  {report.weakPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </div>
                      <span className="text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improvement suggestions */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">改进建议</h2>
                </div>
                <ul className="space-y-4">
                  {report.improvementSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </div>
                      <span className="text-foreground">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  )
}
