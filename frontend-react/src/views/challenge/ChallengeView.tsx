import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Trophy, HelpCircle, Edit, CheckCircle, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useChallengeStore } from "@/stores/challengeStore"

export function ChallengeView() {
  const navigate = useNavigate()
  const {
    todayChallenge,
    loading,
    submitting,
    isCompleted,
    hasReviewPoints,
    fetchTodayChallenge,
    completeChallenge,
  } = useChallengeStore()

  const [userAnswer, setUserAnswer] = useState("")

  useEffect(() => {
    fetchTodayChallenge()
  }, [])

  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      alert("请输入您的答案")
      return
    }

    const response = await completeChallenge(userAnswer)
    if (response?.code === 200) {
      alert("考核完成！")
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-5"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <Trophy className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">每日考核</h1>
          <p className="text-muted-foreground">从复盘点中随机抽取问题，检验学习成果</p>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      )}

      {/* Empty state - no review points */}
      {!loading && !hasReviewPoints && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="py-20 text-center">
            <CardContent>
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-muted">
                <FileText className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">暂无可用的复盘点</h2>
              <p className="mb-6 text-muted-foreground">请先创建复盘点后再进行考核</p>
              <Button size="lg" onClick={() => navigate("/review/create")}>
                <Plus className="mr-2 h-5 w-5" />
                创建复盘点
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Challenge content */}
      {!loading && todayChallenge && (
        <>
          {/* Question card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">今日考核</span>
                  <Badge variant={isCompleted ? "success" : "warning"}>
                    {isCompleted ? "已完成" : "待完成"}
                  </Badge>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold leading-relaxed text-foreground">
                    {todayChallenge.reviewPoint?.question}
                  </h2>
                </div>
                {todayChallenge.reviewPoint?.skillTags?.length && (
                  <div className="mt-4 flex gap-2 pl-[60px]">
                    {todayChallenge.reviewPoint.skillTags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Answer input - not completed */}
          {!isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                      <Edit className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">你的答案</h3>
                      <p className="text-sm text-muted-foreground">请认真思考后作答</p>
                    </div>
                  </div>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={"请在此输入你的答案...\n\n提示：\n1. 先回忆问题的核心概念\n2. 组织清晰的回答结构\n3. 可以包含代码示例"}
                    className="min-h-[250px]"
                  />
                  <div className="mt-4 flex justify-end">
                    <Button size="lg" onClick={handleSubmit} disabled={submitting}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {submitting ? "提交中..." : "提交答案"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Result - completed */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center gap-4 border-b pb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">考核完成</h3>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">你的答案</h4>
                    <div className="whitespace-pre-wrap rounded-xl bg-muted p-5 leading-relaxed text-foreground">
                      {todayChallenge.userAnswer}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
