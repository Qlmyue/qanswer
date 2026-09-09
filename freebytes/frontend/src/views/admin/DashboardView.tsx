import { motion } from 'framer-motion'
import { FileText, FolderTree, Eye, MessageCircle } from 'lucide-react'

const stats = [
  { icon: FileText, label: '文章总数', value: '177', color: '#6C8EBF' },
  { icon: FolderTree, label: '分类数量', value: '13', color: '#8BC34A' },
  { icon: Eye, label: '总访问量', value: '0', color: '#FF9800' },
  { icon: MessageCircle, label: '评论数量', value: '214', color: '#E8A0BF' },
]

export default function DashboardView() {
  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
        >
          仪表盘
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--app-muted-text)' }}>
          欢迎回来，管理员
        </p>
      </motion.div>

      {/* 统计卡片 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="app-card rounded-2xl p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--app-muted-text)' }}>
                {stat.label}
              </span>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${stat.color}20` }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
            </div>
            <p
              className="text-3xl font-bold"
              style={{ color: 'var(--app-text)' }}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 快捷操作 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="app-card rounded-2xl p-6"
      >
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--app-text)' }}>
          快捷操作
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/posts/new"
            className="flex items-center gap-3 rounded-xl p-3 transition-colors no-underline"
            style={{ background: 'var(--app-muted)', color: 'var(--app-text)' }}
          >
            <FileText size={18} style={{ color: 'var(--app-primary)' }} />
            写新文章
          </a>
          <a
            href="/admin/posts"
            className="flex items-center gap-3 rounded-xl p-3 transition-colors no-underline"
            style={{ background: 'var(--app-muted)', color: 'var(--app-text)' }}
          >
            <FolderTree size={18} style={{ color: '#8BC34A' }} />
            管理文章
          </a>
          <a
            href="/admin/comments"
            className="flex items-center gap-3 rounded-xl p-3 transition-colors no-underline"
            style={{ background: 'var(--app-muted)', color: 'var(--app-text)' }}
          >
            <MessageCircle size={18} style={{ color: '#E8A0BF' }} />
            审核评论
          </a>
          <a
            href="/"
            className="flex items-center gap-3 rounded-xl p-3 transition-colors no-underline"
            style={{ background: 'var(--app-muted)', color: 'var(--app-text)' }}
          >
            <Eye size={18} style={{ color: '#FF9800' }} />
            查看前台
          </a>
        </div>
      </motion.div>
    </div>
  )
}
