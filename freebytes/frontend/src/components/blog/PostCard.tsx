import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, MessageCircle, Calendar } from 'lucide-react'
import type { BlogPost } from '@/types'
import { formatDate } from '@/utils/date'

interface PostCardProps {
  post: BlogPost
  index?: number
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.article
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/post/${post.slug}`} className="block no-underline">
        <div
          className="app-card overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1"
          style={{ boxShadow: 'var(--card-shadow)' }}
        >
          {/* 封面图 */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={post.coverUrl || getDefaultCover(post.category?.name)}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* 渐变遮罩 */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.3) 100%)',
              }}
            />
            {/* 分类标签 */}
            {post.category && (
              <span
                className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white"
                style={{ background: 'rgba(108, 142, 191, 0.85)', backdropFilter: 'blur(8px)' }}
              >
                {post.category.icon} {post.category.name}
              </span>
            )}
            {/* 置顶标记 */}
            {post.isTop && (
              <span
                className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ background: 'rgba(232, 160, 191, 0.85)' }}
              >
                置顶
              </span>
            )}
          </div>

          {/* 内容区域 */}
          <div className="p-5">
            <h3
              className="mb-2 text-lg font-bold leading-tight transition-colors group-hover:opacity-80"
              style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
            >
              {post.title}
            </h3>

            {post.summary && (
              <p
                className="mb-3 line-clamp-2 text-sm leading-relaxed"
                style={{ color: 'var(--app-muted-text)' }}
              >
                {post.summary}
              </p>
            )}

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--app-muted-text)' }}>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {post.views}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {post.commentCount}
              </span>
              {post.readingTime > 0 && (
                <span className="ml-auto opacity-60">
                  {post.readingTime} 分钟阅读
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function getDefaultCover(category?: string): string {
  const covers: Record<string, string> = {
    '技术博客': 'https://picsum.photos/seed/tech/800/500',
    '寥寥随笔': 'https://picsum.photos/seed/essay/800/500',
    '原创小说': 'https://picsum.photos/seed/novel/800/500',
  }
  return covers[category || ''] || 'https://picsum.photos/seed/default/800/500'
}
