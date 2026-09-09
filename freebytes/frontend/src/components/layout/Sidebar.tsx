import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Tag, TrendingUp, MessageCircle } from 'lucide-react'
import { useSiteStore } from '@/stores/siteStore'
import { usePostStore } from '@/stores/postStore'
import { formatDate } from '@/utils/date'
import type { BlogPost, Tag as TagType } from '@/types'

export default function Sidebar() {
  const store = useSiteStore()
  const { posts, tags, fetchPosts, fetchTags } = usePostStore()
  const danmaku = store?.danmaku || []
  const [recommendedPosts, setRecommendedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    fetchPosts({ page: 1, pageSize: 5 })
    fetchTags()
  }, [])

  // 从文章列表中选取推荐文章（取前3篇）
  useEffect(() => {
    if (posts.length > 0) {
      setRecommendedPosts(posts.slice(0, 3))
    }
  }, [posts])

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
              to={`/post/${post.slug}`}
              className="group block no-underline"
            >
              <p
                className="text-sm transition-colors group-hover:opacity-80"
                style={{ color: 'var(--app-text)' }}
              >
                {post.title}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--app-muted-text)' }}>
                {formatDate(post.publishedAt)}
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
          {tags.slice(0, 10).map((tag) => (
            <Link
              key={tag.id}
              to={`/tag/${tag.slug}`}
              className="rounded-full px-3 py-1 text-xs no-underline transition-all hover:scale-105"
              style={{
                background: `var(--app-secondary)`,
                color: 'var(--app-primary)',
                border: '1px solid var(--app-border)',
              }}
            >
              {tag.name}
              <span className="ml-1 opacity-60">({tag.postCount})</span>
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
