import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSiteStore } from '@/stores/siteStore'

const stats = [
  { icon: '📖', label: '文章', value: 177 },
  { icon: '📒', label: '分类', value: 13 },
  { icon: '🏷️', label: '标签', value: 60 },
  { icon: '🔥', label: '访问量', value: 0 },
]

function TypingText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[index])
        setIndex(prev => prev + 1)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [index, text])

  return (
    <span>
      {displayText}
      <span className="typing-cursor" style={{ color: 'var(--app-primary)' }}>|</span>
    </span>
  )
}

export default function WaveBanner() {
  const { stats: siteStats } = useSiteStore()

  const displayStats = stats.map(s => ({
    ...s,
    value: s.label === '访问量' ? (siteStats?.totalViews || 0) : s.value,
  }))

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        minHeight: '400px',
      }}
    >
      {/* 装饰性光晕 */}
      <div
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
      />
      <div
        className="absolute -left-20 bottom-0 h-48 w-48 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #f8c8dc 0%, transparent 70%)' }}
      />

      {/* 主内容 */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-20 text-center sm:px-6">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          style={{ fontFamily: '"Noto Serif SC", serif', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
        >
          相信记录的力量
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 text-xl text-white/90"
          style={{ fontFamily: '"Noto Serif SC", serif' }}
        >
          <TypingText text="用文字记录技术与生活" />
        </motion.div>

        {/* 统计数据 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {displayStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-white/90"
              style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}
            >
              <span>{stat.icon}</span>
              <span className="text-sm">{stat.label}</span>
              <span className="font-bold">{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 波浪动画 */}
      <div className="absolute bottom-0 left-0 w-full" style={{ lineHeight: 0 }}>
        <svg
          className="wave-animation"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          style={{ width: '200%', height: '80px' }}
        >
          <path
            d="M0,60 C300,120 600,0 900,60 C1200,120 1500,0 1800,60 C2100,120 2400,0 2400,60 L2400,120 L0,120 Z"
            fill="rgba(255, 255, 255, 0.3)"
          />
        </svg>
        <svg
          className="wave-animation-slow"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          style={{ width: '200%', height: '60px', marginTop: '-30px' }}
        >
          <path
            d="M0,80 C400,20 800,100 1200,60 C1600,20 2000,100 2400,80 L2400,120 L0,120 Z"
            fill="rgba(255, 255, 255, 0.5)"
          />
        </svg>
        <svg
          className="wave-animation"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          style={{ width: '200%', height: '40px', marginTop: '-20px', animationDuration: '20s' }}
        >
          <path
            d="M0,40 C200,100 400,20 600,60 C800,100 1000,20 1200,40 C1400,100 1600,20 1800,60 C2000,100 2200,20 2400,40 L2400,120 L0,120 Z"
            fill="#f5f7fa"
          />
        </svg>
      </div>
    </div>
  )
}
