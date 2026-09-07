import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FileText, CheckCircle, User, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuthStore } from "@/stores/authStore"

export function LoginView() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuthStore()

  const [form, setForm] = useState({
    username: "preview_demo",
    password: "Preview2026!",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(form)
    if (success) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden gradient-primary">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-20 -top-48 h-[600px] w-[600px] rounded-full bg-white/10"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-white/10"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10"
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left brand area */}
        <div className="hidden flex-1 items-center justify-center p-10 lg:flex">
          <div className="max-w-md text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl"
            >
              <FileText className="h-12 w-12" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 text-4xl font-bold"
            >
              复盘大会
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10 text-lg opacity-90"
            >
              智能面试准备助手，助你轻松应对技术面试
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              {["AI智能生成答案", "每日考核强化记忆", "知识薄弱点分析"].map(
                (feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-lg opacity-90">
                    <CheckCircle className="h-5 w-5" />
                    <span>{feature}</span>
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>

        {/* Right login form */}
        <div className="flex items-center justify-center p-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-[420px] border-0 shadow-xl">
              <CardHeader className="pb-6 text-center">
                <CardTitle className="text-2xl font-semibold">欢迎回来</CardTitle>
                <CardDescription>登录您的账号继续学习</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="username"
                        placeholder="请输入用户名"
                        value={form.username}
                        onChange={(e) =>
                          setForm({ ...form, username: e.target.value })
                        }
                        className="h-12 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="请输入密码"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        className="h-12 pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-2xl bg-red-50 p-3 text-sm text-red-600"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="h-12 w-full text-base"
                    disabled={loading}
                  >
                    {loading ? "登录中..." : "登录"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  还没有账号？
                  <Button
                    variant="link"
                    className="h-auto p-0 pl-1"
                    onClick={() => navigate("/register")}
                  >
                    立即注册
                  </Button>
                </div>

                <div className="mt-6 rounded-2xl bg-muted p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    测试账号
                  </p>
                  <p className="text-sm">
                    用户名: <strong>preview_demo</strong>，密码:{" "}
                    <strong>Preview2026!</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
