import { motion } from "framer-motion"
import type { LucideProps } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<LucideProps>
  color?: string
  trend?: number
}

export function StatsCard({ title, value, icon: Icon, color = "#6366f1", trend }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="app-card relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground">{title}</span>
          <span className="text-[27px] font-extrabold tracking-tight text-foreground">{value}</span>
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend > 0 ? "text-emerald-500" : trend < 0 ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {trend > 0 ? "+" : ""}{trend}%
            </div>
          )}
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            color: color,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[3px]">
        <div
          className="h-full"
          style={{
            background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 60%, transparent))`,
          }}
        />
      </div>
    </motion.div>
  )
}
