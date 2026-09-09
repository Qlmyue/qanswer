import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Send } from 'lucide-react'
import { useSiteStore } from '@/stores/siteStore'

const colors = ['#6C8EBF', '#E8A0BF', '#8BC34A', '#FF9800', '#9C27B0', '#00BCD4', '#F44336', '#795548']

export default function DanmakuWall() {
  const { danmaku, addDanmaku } = useSiteStore()
  const [input, setInput] = useState('')
  const [selectedColor, setSelectedColor] = useState(colors[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    await addDanmaku(input.trim(), selectedColor)
    setInput('')
  }

  return (
    <div className="app-card rounded-2xl p-5">
      <h3
        className="mb-4 flex items-center gap-2 text-sm font-bold"
        style={{ color: 'var(--app-text)' }}
      >
        <Zap size={16} style={{ color: '#E8A0BF' }} />
        弹幕墙
      </h3>

      {/* 弹幕显示区域 */}
      <div
        className="relative mb-4 h-48 overflow-hidden rounded-xl"
        style={{ background: 'var(--app-muted)' }}
      >
        {danmaku.length > 0 ? (
          danmaku.slice(0, 15).map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ x: '110%' }}
              animate={{ x: '-110%' }}
              transition={{
                duration: 8 + Math.random() * 5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'linear',
              }}
              className="absolute whitespace-nowrap text-sm font-medium"
              style={{
                top: `${(i % 8) * 24 + 8}px`,
                color: d.color || 'var(--app-text)',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {d.content}
            </motion.div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm" style={{ color: 'var(--app-muted-text)' }}>
              暂无弹幕，快来发射第一条吧~
            </p>
          </div>
        )}
      </div>

      {/* 发送弹幕 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="发送弹幕..."
          maxLength={50}
          className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
          style={{
            background: 'var(--app-muted)',
            borderColor: 'var(--app-border)',
            color: 'var(--app-text)',
          }}
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: selectedColor }}
        >
          <Send size={14} />
          发送
        </button>
      </form>

      {/* 颜色选择 */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--app-muted-text)' }}>颜色：</span>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className="h-5 w-5 rounded-full transition-transform hover:scale-110"
            style={{
              background: color,
              border: selectedColor === color ? '2px solid var(--app-text)' : '2px solid transparent',
            }}
          />
        ))}
      </div>
    </div>
  )
}
