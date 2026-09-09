import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Tag, TrendingUp, MessageCircle } from 'lucide-react'
import { useSiteStore } from '@/stores/siteStore'
import { formatDate } from '@/utils/date'

export default function Sidebar() {
  const store = useSiteStore()
  const danmaku = store?.danmaku || []

  // 模拟推荐文章（实际从 API 获取）
  const recommendedPosts = [
    { id: '1', title: 'Docker 简介', date: '2019-08-15' },
    { id: '2', title: 'Spring Boot 入门', date: '2020-03-20' },
    { id: '3', title: 'Redis 缓存策略', date: '2021-06-10' },
  ]

  // 模拟标签云
  const tags = [
    { name: 'docker', count: 15 },
    { name: 'java', count: 28 },
    { name: 'spring', count: 22 },
    { name: 'linux', count: 18 },
    { name: 'mysql', count: 12 },
    { name: 'redis', count: 10 },
    { name: 'python', count: 8 },
    { name: 'nginx', count: 6 },
    { name: 'vue', count: 14 },
    { name: 'react', count: 9 },
  ]

  return (
    <aside className="space-y-6">
      {/* 搜索框 */}
      <div
        className="app-card rounded-2xl p-4"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const input = form.elements.namedItem('q') as HTMLInputElement
            if (input.value.trim()) {
              window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`
            }
          }}
          className="flex items-center gap-2"
        >
          <Search size={16} style={{ color: 'var(--app-muted-text)' }} />
          <input
            name="q"
            type="text"
            placeholder="搜索文章..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--app-text)' }}
          />
        </form>
      </div>

      {/* 推荐文章 */}
      <div className="app-card rounded-2xl p-5">
        <h3
          className="mb-4 flex items-center gap-2 text-sm font-bold"
          style={{ color: 'var(--app-text)' }}
        >
          <TrendingUp size={16} style={{ color: 'var(--app-primary)' }} />
          推荐文章
        </h3>
        <div className="space-y-3">
          {recommendedPosts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="group block no-underline"
            >
              <p
                className="text-sm transition-colors group-hover:opacity-80"
                style={{ color: 'var(--app-text)' }}
              >
                {post.title}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--app-muted-text)' }}>
                {formatDate(post.date)}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 标签云 */}
      <div className="app-card rounded-2xl p-5">
        <h3
          className="mb-4 flex items-center gap-2 text-sm font-bold"
          style={{ color: 'var(--app-text)' }}
        >
          <Tag size={16} style={{ color: 'var(--app-accent)' }} />
          标签云
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              to={`/tag/${tag.name}`}
              className="rounded-full px-3 py-1 text-xs no-underline transition-all hover:scale-105"
              style={{
                background: `var(--app-secondary)`,
                color: 'var(--app-primary)',
                border: '1px solid var(--app-border)',
              }}
            >
              {tag.name}
              <span className="ml-1 opacity-60">({tag.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 弹幕区域 */}
      <div className="app-card rounded-2xl p-5">
        <h3
          className="mb-4 flex items-center gap-2 text-sm font-bold"
          style={{ color: 'var(--app-text)' }}
        >
          <MessageCircle size={16} style={{ color: '#E8A0BF' }} />
          最新弹幕
        </h3>
        <div className="relative h-32 overflow-hidden">
          {Array.isArray(danmaku) && danmaku.length > 0 ? (
            danmaku.slice(0, 8).map((d: { id: string; content: string; color?: string }, i: number) => (
              <motion.div
                key={d.id}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: '-100%', opacity: 1 }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  delay: i * 1.5,
                }}
                className="absolute whitespace-nowrap text-sm"
                style={{
                  top: `${i * 16}px`,
                  color: d.color || 'var(--app-muted-text)',
                }}
              >
                {d.content}
              </motion.div>
            ))
          ) : (
            <p className="text-sm" style={{ color: 'var(--app-muted-text)' }}>
              暂无弹幕，快来发送一条吧~
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
