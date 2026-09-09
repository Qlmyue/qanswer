import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save } from 'lucide-react'
import type { Category, CreateCategoryData } from '@/types'
import { categoryApi } from '@/services'

export default function CategoryManageView() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    slug: '',
    icon: '',
    sortOrder: 0,
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await categoryApi.getCategories()
      setCategories(data)
    } catch (e) {
      console.error('加载分类失败:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.slug.trim()) return

    try {
      if (editingId) {
        await categoryApi.updateCategory(editingId, formData)
      } else {
        await categoryApi.createCategory(formData)
      }
      setFormData({ name: '', slug: '', icon: '', sortOrder: 0 })
      setEditingId(null)
      setShowForm(false)
      loadCategories()
    } catch (e) {
      console.error('保存分类失败:', e)
    }
  }

  const handleEdit = (cat: Category) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '',
      parentId: cat.parentId || undefined,
      sortOrder: cat.sortOrder,
    })
    setEditingId(cat.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？')) return
    try {
      await categoryApi.deleteCategory(id)
      loadCategories()
    } catch (e) {
      console.error('删除分类失败:', e)
    }
  }

  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
          分类管理
        </h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', slug: '', icon: '', sortOrder: 0 }) }}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white"
          style={{ background: 'var(--app-primary)' }}
        >
          <Plus size={16} />
          新建分类
        </button>
      </motion.div>

      {/* 表单 */}
      {showForm && (
        <motion.form
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          onSubmit={handleSubmit}
          className="app-card mb-6 rounded-2xl p-6"
        >
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="分类名称 *"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="rounded-xl border px-4 py-2.5 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            />
            <input
              type="text"
              placeholder="URL Slug *"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
              className="rounded-xl border px-4 py-2.5 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            />
          </div>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="图标 (emoji)"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="rounded-xl border px-4 py-2.5 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            />
            <input
              type="number"
              placeholder="排序"
              value={formData.sortOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
              className="rounded-xl border px-4 py-2.5 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--app-primary)' }}
            >
              <Save size={14} />
              {editingId ? '更新' : '创建'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null) }}
              className="rounded-xl px-4 py-2 text-sm"
              style={{ background: 'var(--app-muted)', color: 'var(--app-text)' }}
            >
              取消
            </button>
          </div>
        </motion.form>
      )}

      {/* 分类列表 */}
      <div className="app-card overflow-hidden rounded-2xl">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--app-muted)' }}>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>图标</th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>Slug</th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>文章数</th>
              <th className="px-4 py-3 text-right text-sm font-medium" style={{ color: 'var(--app-muted-text)' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>加载中...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>暂无分类</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-t" style={{ borderColor: 'var(--app-border)' }}>
                  <td className="px-4 py-3 text-xl">{cat.icon || '📁'}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--app-text)' }}>{cat.name}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--app-muted-text)' }}>{cat.slug}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--app-muted-text)' }}>{cat.postCount}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(cat)} className="rounded-lg p-1.5" style={{ color: 'var(--app-primary)' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="rounded-lg p-1.5" style={{ color: '#F44336' }}>
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
    </div>
  )
}
