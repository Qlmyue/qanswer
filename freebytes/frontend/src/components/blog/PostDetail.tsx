import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Eye, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import type { BlogPost } from '@/types'
import { formatDate } from '@/utils/date'
import { markdownToHtml, extractToc } from '@/utils/markdown'

interface PostDetailProps {
  post: BlogPost
  prevPost?: BlogPost | null
  nextPost?: BlogPost | null
}

export default function PostDetail({ post, prevPost, nextPost }: PostDetailProps) {
  const [htmlContent, setHtmlContent] = useState('')
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([])

  useEffect(() => {
    const renderMarkdown = async () => {
      const html = await markdownToHtml(post.contentMd)
      setHtmlContent(html)
      setToc(extractToc(post.contentMd))
    }
    renderMarkdown()
  }, [post.contentMd])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* 返回按钮 */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-6"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--app-muted-text)' }}
        >
          <ChevronLeft size={16} />
          返回列表
        </Link>
      </motion.div>

      {/* 文章头部 */}
      <motion.header
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        {/* 封面图 */}
        {post.coverUrl && (
          <div className="mb-6 overflow-hidden rounded-2xl">
            <img
              src={post.coverUrl}
              alt={post.title}
              className="w-full object-cover"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        <h1
          className="mb-4 text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
        >
          {post.title}
        </h1>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--app-muted-text)' }}>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {post.views} 次阅读
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {post.readingTime} 分钟阅读
          </span>
          {post.category && (
            <Link
              to={`/category/${post.category.slug}`}
              className="rounded-full px-3 py-0.5 text-xs no-underline"
              style={{ background: 'var(--app-secondary)', color: 'var(--app-primary)' }}
            >
              {post.category.icon} {post.category.name}
            </Link>
          )}
        </div>

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Tag size={14} style={{ color: 'var(--app-muted-text)' }} />
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                className="rounded-full px-2.5 py-0.5 text-xs no-underline transition-colors"
                style={{
                  background: 'var(--app-muted)',
                  color: 'var(--app-primary)',
                  border: '1px solid var(--app-border)',
                }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </motion.header>

      {/* 文章目录 */}
      {toc.length > 2 && (
        <motion.nav
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="app-card mb-8 rounded-2xl p-5"
        >
          <h3 className="mb-3 text-sm font-bold" style={{ color: 'var(--app-text)' }}>
            📋 文章目录
          </h3>
          <ul className="space-y-1.5">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block text-sm no-underline transition-colors hover:opacity-80"
                  style={{
                    color: 'var(--app-muted-text)',
                    paddingLeft: `${(item.level - 1) * 16}px`,
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}

      {/* 文章内容 */}
      <motion.article
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="app-card rounded-2xl p-6 sm:p-8"
      >
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </motion.article>

      {/* 上下篇导航 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 grid gap-4 sm:grid-cols-2"
      >
        {prevPost ? (
          <Link
            to={`/post/${prevPost.slug}`}
            className="app-card flex items-center gap-3 rounded-2xl p-4 no-underline transition-all hover:-translate-y-0.5"
          >
            <ChevronLeft size={20} style={{ color: 'var(--app-primary)' }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--app-muted-text)' }}>上一篇</p>
              <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                {prevPost.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextPost && (
          <Link
            to={`/post/${nextPost.slug}`}
            className="app-card flex items-center justify-end gap-3 rounded-2xl p-4 no-underline transition-all hover:-translate-y-0.5"
          >
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--app-muted-text)' }}>下一篇</p>
              <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                {nextPost.title}
              </p>
            </div>
            <ChevronRight size={20} style={{ color: 'var(--app-primary)' }} />
          </Link>
        )}
      </motion.div>
    </div>
  )
}
