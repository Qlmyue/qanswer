import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, FileText } from 'lucide-react'
import { usePostStore } from '@/stores/postStore'
import { formatDate, getYear } from '@/utils/date'

export default function ArchiveView() {
  const { posts, loading, fetchPosts } = usePostStore()

  useEffect(() => {
    fetchPosts({ pageSize: 200 })
  }, [])

  // 按年份分组
  const postsByYear = posts.reduce<Record<number, typeof posts>>((acc, post) => {
    const year = getYear(post.publishedAt)
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {})

  const years = Object.keys(postsByYear).map(Number).sort((a, b) => b - a)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 text-center"
      >
        <h1
          className="mb-2 text-3xl font-bold"
          style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
        >
          📚 文章归档
        </h1>
        <p style={{ color: 'var(--app-muted-text)' }}>
          共 {posts.length} 篇文章
        </p>
      </motion.div>

      {loading ? (
        <div className="py-12 text-center" style={{ color: 'var(--app-muted-text)' }}>
          加载中...
        </div>
      ) : (
        <div className="space-y-8">
          {years.map((year, yearIndex) => (
            <motion.div
              key={year}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: yearIndex * 0.1 }}
            >
              <h2
                className="mb-4 flex items-center gap-2 text-xl font-bold"
                style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
              >
                <Calendar size={20} style={{ color: 'var(--app-primary)' }} />
                {year}
                <span className="text-sm font-normal" style={{ color: 'var(--app-muted-text)' }}>
                  ({postsByYear[year].length} 篇)
                </span>
              </h2>

              <div className="space-y-2">
                {postsByYear[year].map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.slug}`}
                    className="app-card flex items-center gap-4 rounded-xl px-4 py-3 no-underline transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-sm" style={{ color: 'var(--app-muted-text)' }}>
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex-1 font-medium" style={{ color: 'var(--app-text)' }}>
                      {post.title}
                    </span>
                    {post.category && (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{ background: 'var(--app-secondary)', color: 'var(--app-primary)' }}
                      >
                        {post.category.name}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
