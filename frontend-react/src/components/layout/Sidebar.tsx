import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  Trophy,
  PenLine,
  BarChart3,
  List,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  collapsed: boolean
}

interface MenuItem {
  path: string
  title: string
  icon: React.ElementType
  description: string
  color: string
  gradient: string
  iconBg: string
}

const menuItems: MenuItem[] = [
  {
    path: "/dashboard",
    title: "仪表盘",
    icon: LayoutDashboard,
    description: "数据概览",
    color: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    path: "/review",
    title: "复盘点管理",
    icon: FileText,
    description: "面试问答",
    color: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    path: "/challenge",
    title: "每日考核",
    icon: Trophy,
    description: "强化记忆",
    color: "text-amber-600",
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50",
  },
  {
    path: "/practice",
    title: "每日练习",
    icon: PenLine,
    description: "持续练习",
    color: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-50",
  },
  {
    path: "/analysis",
    title: "周度分析",
    icon: BarChart3,
    description: "深度复盘",
    color: "text-rose-600",
    gradient: "from-rose-500 to-pink-500",
    iconBg: "bg-rose-50",
  },
  {
    path: "/skills",
    title: "技能管理",
    icon: List,
    description: "边界界定",
    color: "text-cyan-600",
    gradient: "from-cyan-500 to-sky-500",
    iconBg: "bg-cyan-50",
  },
  {
    path: "/export",
    title: "数据导出",
    icon: Download,
    description: "导出MD",
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-violet-500",
    iconBg: "bg-indigo-50",
  },
]

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const getActiveMenu = () => {
    const path = location.pathname
    if (path.startsWith("/review")) return "/review"
    if (path.startsWith("/challenge")) return "/challenge"
    if (path.startsWith("/practice")) return "/practice"
    if (path.startsWith("/analysis")) return "/analysis"
    if (path.startsWith("/skills")) return "/skills"
    if (path.startsWith("/export")) return "/export"
    return path
  }

  const activeMenu = getActiveMenu()

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 border-r border-gray-100 bg-gradient-to-b from-gray-50/80 to-white transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <nav className="p-3 pt-4">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.path
          const Icon = item.icon

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "mb-1.5 flex w-full items-center rounded-2xl px-3 py-3 text-left transition-all duration-200",
                isActive
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.color.split('-')[1]}/25`
                  : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-white/25"
                    : item.iconBg
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] transition-colors duration-200",
                    isActive ? "text-white" : item.color
                  )}
                />
              </div>
              {!collapsed && (
                <div className="ml-3 flex flex-col">
                  <span className={cn("text-sm font-medium", isActive ? "text-white" : "text-gray-700")}>
                    {item.title}
                  </span>
                  <span className={cn("text-[11px]", isActive ? "text-white/70" : "text-gray-400")}>
                    {item.description}
                  </span>
                </div>
              )}
            </motion.button>
          )
        })}
      </nav>
    </aside>
  )
}
