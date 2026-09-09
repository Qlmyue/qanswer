import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, Eye, ArrowLeft } from 'lucide-react'
import RichEditor from '@/components/editor/RichEditor'
import type { CreatePostData, Category, Tag } from '@/types'
import { postApi, categoryApi } from '@/services'

export default function PostEditView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    slug: '',
    summary: '',
    contentMd: '',
    categoryId: '',
    tagIds: [],
    status: 'draft',
    isTop: false,
  })

  useEffect(() => {
    loadCategories()
    if (isEdit) {
      loadPost()
    }
  }, [id])

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getCategories()
      setCategories(data)
    } catch (e) {
      console.error('加载分类失败:', e)
    }
  }

  const loadPost = async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await postApi.getPostRaw(id)
      setFormData(prev => ({ ...prev, contentMd: res.content }))
    } catch (e) {
      console.error('加载文章失败:', e)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w一-龥]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50)
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }))
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!formData.title.trim() || !formData.contentMd.trim()) {
      alert('标题和内容不能为空')
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        await postApi.updatePost(id!, { ...formData, status })
      } else {
        await postApi.createPost({ ...formData, status })
      }
      navigate('/admin/posts')
    } catch (e) {
      console.error('保存文章失败:', e)
      alert('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/posts')}
            className="rounded-lg p-2 transition-colors"
            style={{ color: 'var(--app-muted-text)' }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
            {isEdit ? '编辑文章' : '新建文章'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--app-muted)', color: 'var(--app-text)' }}
          >
            <Save size={14} />
            保存草稿
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--app-primary)' }}
          >
            <Eye size={14} />
            发布
          </button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* 编辑器主区域 */}
        <div className="lg:col-span-3">
          <div className="app-card rounded-2xl p-6">
            {/* 标题 */}
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="文章标题..."
              className="mb-4 w-full border-0 bg-transparent text-2xl font-bold outline-none"
              style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
            />

            {/* Slug */}
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="url-slug"
              className="mb-4 w-full rounded-lg border px-3 py-1.5 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            />

            {/* 富文本编辑器 */}
            <RichEditor
              content={formData.contentMd}
              onChange={(content) => setFormData(prev => ({ ...prev, contentMd: content }))}
            />
          </div>
        </div>

        {/* 侧边栏设置 */}
        <div className="space-y-4">
          {/* 分类选择 */}
          <div className="app-card rounded-2xl p-4">
            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>
              分类
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            >
              <option value="">选择分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 摘要 */}
          <div className="app-card rounded-2xl p-4">
            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>
              摘要
            </label>
            <textarea
              value={formData.summary || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="文章摘要..."
              rows={4}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            />
          </div>

          {/* 封面图 */}
          <div className="app-card rounded-2xl p-4">
            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>
              封面图 URL
            </label>
            <input
              type="url"
              value={formData.coverUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, coverUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            />
          </div>

          {/* 置顶 */}
          <div className="app-card rounded-2xl p-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isTop || false}
                onChange={(e) => setFormData(prev => ({ ...prev, isTop: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm" style={{ color: 'var(--app-text)' }}>置顶文章</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
