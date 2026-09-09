import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import FriendLinks from '@/components/social/FriendLinks'
import type { FriendLink } from '@/types'
import { friendApi } from '@/services'

export default function FriendsView() {
  const [friends, setFriends] = useState<FriendLink[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    avatar: '',
    description: '',
  })

  useEffect(() => {
    loadFriends()
  }, [])

  const loadFriends = async () => {
    setLoading(true)
    try {
      const data = await friendApi.getFriends()
      setFriends(data)
    } catch (e) {
      console.error('加载友链失败:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.url.trim()) return

    try {
      await friendApi.createFriend({
        name: formData.name,
        url: formData.url,
        avatar: formData.avatar || undefined,
        description: formData.description || undefined,
      })
      setFormData({ name: '', url: '', avatar: '', description: '' })
      setShowForm(false)
      loadFriends()
    } catch (e) {
      console.error('申请友链失败:', e)
    }
  }

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
          🔗 友人帐
        </h1>
        <p style={{ color: 'var(--app-muted-text)' }}>
          志同道合的朋友们
        </p>
      </motion.div>

      {/* 申请友链按钮 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 text-center"
      >
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:opacity-90"
          style={{ background: 'var(--app-secondary)', color: 'var(--app-primary)' }}
        >
          <Plus size={16} />
          申请友链
        </button>
      </motion.div>

      {/* 申请表单 */}
      {showForm && (
        <motion.form
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          onSubmit={handleSubmit}
          className="app-card mb-6 rounded-2xl p-6"
        >
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="网站名称 *"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="rounded-xl border px-4 py-2.5 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            />
            <input
              type="url"
              placeholder="网站地址 *"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
              className="rounded-xl border px-4 py-2.5 text-sm outline-none"
              style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
            />
          </div>
          <input
            type="url"
            placeholder="头像地址（选填）"
            value={formData.avatar}
            onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
            className="mb-4 w-full rounded-xl border px-4 py-2.5 text-sm outline-none"
            style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
          />
          <input
            type="text"
            placeholder="网站描述（选填）"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mb-4 w-full rounded-xl border px-4 py-2.5 text-sm outline-none"
            style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
          />
          <button
            type="submit"
            className="rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: 'var(--app-primary)' }}
          >
            提交申请
          </button>
        </motion.form>
      )}

      {/* 友链列表 */}
      {loading ? (
        <div className="py-12 text-center" style={{ color: 'var(--app-muted-text)' }}>
          加载中...
        </div>
      ) : (
        <FriendLinks friends={friends} />
      )}
    </div>
  )
}
