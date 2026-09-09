import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import type { BlogPost } from '@/types'
import { postApi } from '@/services'
import { formatDate } from '@/utils/date'

export default function PostListView() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadPosts()
  }, [page])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const res = await postApi.getPosts({ page, pageSize: 20, search: search || undefined })
      setPosts(res.items)
      setTotal(res.total)
    } catch (e) {
      console.error('加载文章失败:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    try {
      await postApi.deletePost(id)
      loadPosts()
    } catch (e) {
      console.error('删除文章失败:', e)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadPosts()
  }

  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
          文章管理
        </h1>
        <Link
          to="/admin/posts/new"
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white no-underline transition-all hover:opacity-90"
          style={{ background: 'var(--app-primary)' }}
        >
          <Plus size={16} />
          新建文章
        </Link>
      </motion.div>

      {/* 搜索 */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索文章..."
          className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none"
          style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
          style={{ background: 'var(--app-primary)' }}
        >
          <Search size={14} />
          搜索
        </button>
      </form>

      {/* 文章列表 */}
      <div className="app-card overflow-hidden rounded-2xl">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--app-muted)' }}>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>标题</th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>阅读量</th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>发布时间</th>
              <th className="px-4 py-3 text-right text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>
                  加载中...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>
                  暂无文章
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-t" style={{ borderColor: 'var(--app-border)' }}>
                  <td className="px-4 py-3">
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium no-underline transition-colors hover:opacity-80"
                      style={{ color: 'var(--app-text)' }}
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--app-muted-text)' }}>
                    {post.category?.name || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{
                        background: post.status === 'published' ? '#E8F5E9' : '#FFF3E0',
                        color: post.status === 'published' ? '#4CAF50' : '#FF9800',
                      }}
                    >
                      {post.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--app-muted-text)' }}>
                    {post.views}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--app-muted-text)' }}>
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="rounded-lg p-1.5 transition-colors"
                        style={{ color: 'var(--app-primary)' }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="rounded-lg p-1.5 transition-colors"
                        style={{ color: '#F44336' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {total > 20 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg px-3 py-1.5 text-sm transition-colors disabled:opacity-50"
            style={{ background: 'var(--app-muted)', color: 'var(--app-text)' }}
          >
            上一页
          </button>
          <span className="px-3 py-1.5 text-sm" style={{ color: 'var(--app-muted-text)' }}>
            {page} / {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="rounded-lg px-3 py-1.5 text-sm transition-colors disabled:opacity-50"
            style={{ background: 'var(--app-muted)', color: 'var(--app-text)' }}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
