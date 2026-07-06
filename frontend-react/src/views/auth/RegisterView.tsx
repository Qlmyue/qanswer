import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FileText, User, Mail, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuthStore } from "@/stores/authStore"

export function RegisterView() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuthStore()

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [validationError, setValidationError] = useState("")

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setValidationError("两次输入的密码不一致")
      return false
    }
    if (form.password.length < 8) {
      setValidationError("密码长度不能少于 8 个字符")
      return false
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      setValidationError("密码必须包含大小写字母和数字")
      return false
    }
    setValidationError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const success = await register({
      username: form.username,
      email: form.email,
      password: form.password,
    })
    if (success) {
      navigate("/dashboard")
    }
  }

  const displayError = error || validationError

  return (
    <div className="flex min-h-screen items-center justify-center gradient-primary p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-[420px] border-0 shadow-xl">
          <CardHeader className="pb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">AI面试复盘</CardTitle>
            <CardDescription>创建新账号</CardDescription>
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
                <Label htmlFor="email">邮箱</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="请再次输入密码"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>

              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-2xl bg-red-50 p-3 text-sm text-red-600"
                >
                  <AlertCircle className="h-4 w-4" />
                  {displayError}
                </motion.div>
              )}

              <Button
                type="submit"
                className="h-12 w-full text-base"
                disabled={loading}
              >
                {loading ? "注册中..." : "注册"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              已有账号？
              <Button
                variant="link"
                className="h-auto p-0 pl-1"
                onClick={() => navigate("/login")}
              >
                立即登录
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
