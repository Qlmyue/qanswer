import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PenLine, Calendar, MessageCircle, Edit, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePracticeStore } from "@/stores/practiceStore"
import { formatDate } from "@/utils/date"

export function PracticeView() {
  const {
    todayPractice,
    loading,
    submitting,
    fetchTodayPractice,
    submitAnswer,
  } = usePracticeStore()

  const [userAnswer, setUserAnswer] = useState("")

  useEffect(() => {
    fetchTodayPractice()
  }, [])

  const isAnswered = todayPractice?.isAnswered ?? false

  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      alert("请输入您的答案")
      return
    }

    const response = await submitAnswer(userAnswer)
    if (response?.code === 200) {
      alert("答案提交成功！")
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
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PenLine className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">每日练习</h1>
          <p className="text-muted-foreground">每天一道新题目，持续提升面试能力</p>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      )}

      {/* Practice content */}
      {!loading && todayPractice && (
        <>
          {/* Date and status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm">{formatDate(todayPractice.practiceDate)}</span>
            <Badge variant={isAnswered ? "success" : "warning"}>
              {isAnswered ? "已回答" : "待回答"}
            </Badge>
          </motion.div>

          {/* Question card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  今日练习题
                </div>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold leading-relaxed text-foreground">
                    {todayPractice.question}
                  </h2>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Answer input - not answered */}
          {!isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Edit className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">你的答案</h3>
                      <p className="text-sm text-muted-foreground">认真思考后作答</p>
                    </div>
                  </div>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={"请在此输入你的答案...\n\n提示：先理解问题，再组织语言，最后检查答案的完整性"}
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

          {/* Result - answered */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center gap-4 border-b pb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">已提交答案</h3>
                  </div>
                  <div className="whitespace-pre-wrap rounded-xl bg-muted p-5 leading-relaxed text-foreground">
                    {todayPractice.userAnswer}
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
