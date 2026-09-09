import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, Link2 } from 'lucide-react'
import type { FriendLink, CreateFriendData } from '@/types'
import { friendApi } from '@/services'

export default function FriendManageView() {
  const [friends, setFriends] = useState<FriendLink[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateFriendData>({
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
      if (editingId) {
        await friendApi.updateFriend(editingId, formData)
      } else {
        await friendApi.createFriend(formData)
      }
      setFormData({ name: '', url: '', avatar: '', description: '' })
      setEditingId(null)
      setShowForm(false)
      loadFriends()
    } catch (e) {
      console.error('保存友链失败:', e)
    }
  }

  const handleEdit = (friend: FriendLink) => {
    setFormData({
      name: friend.name,
      url: friend.url,
      avatar: friend.avatar || '',
      description: friend.description || '',
    })
    setEditingId(friend.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条友链吗？')) return
    try {
      await friendApi.deleteFriend(id)
      loadFriends()
    } catch (e) {
      console.error('删除友链失败:', e)
    }
  }

  return (
    <div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
          <Link2 size={24} style={{ color: 'var(--app-primary)' }} />
          友链管理
        </h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', url: '', avatar: '', description: '' }) }}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white"
          style={{ background: 'var(--app-primary)' }}
        >
          <Plus size={16} />
          添加友链
        </button>
      </motion.div>

      {showForm && (
        <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} onSubmit={handleSubmit} className="app-card mb-6 rounded-2xl p-6">
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <input type="text" placeholder="网站名称 *" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required className="rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
            <input type="url" placeholder="网站地址 *" value={formData.url} onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))} required className="rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
          </div>
          <input type="url" placeholder="头像地址" value={formData.avatar} onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))} className="mb-4 w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
          <input type="text" placeholder="描述" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="mb-4 w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
          <div className="flex gap-2">
            <button type="submit" className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white" style={{ background: 'var(--app-primary)' }}>
              <Save size={14} /> {editingId ? '更新' : '添加'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="rounded-xl px-4 py-2 text-sm" style={{ background: 'var(--app-muted)', color: 'var(--app-text)' }}>取消</button>
          </div>
        </motion.form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>加载中...</div>
        ) : friends.length === 0 ? (
          <div className="col-span-full app-card rounded-2xl p-8 text-center" style={{ color: 'var(--app-muted-text)' }}>暂无友链</div>
        ) : (
          friends.map((friend) => (
            <motion.div key={friend.id} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="app-card rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full" style={{ background: 'var(--app-secondary)' }}>
                  {friend.avatar ? (
                    <img src={friend.avatar} alt={friend.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-bold" style={{ color: 'var(--app-primary)' }}>{friend.name[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--app-text)' }}>{friend.name}</p>
                  <p className="truncate text-xs" style={{ color: 'var(--app-muted-text)' }}>{friend.url}</p>
                </div>
              </div>
              {friend.description && <p className="mb-3 text-sm" style={{ color: 'var(--app-muted-text)' }}>{friend.description}</p>}
              <div className="flex gap-2">
                <button onClick={() => handleEdit(friend)} className="rounded-lg p-1.5" style={{ color: 'var(--app-primary)' }}><Edit size={16} /></button>
                <button onClick={() => handleDelete(friend.id)} className="rounded-lg p-1.5" style={{ color: '#F44336' }}><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
