import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { GuestbookMessage } from '@/types'
import { guestbookApi } from '@/services'
import { formatDate } from '@/utils/date'

export default function GuestbookManageView() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const res = await guestbookApi.getMessages({ page: 1, pageSize: 100 })
      setMessages(res.items)
    } catch (e) {
      console.error('加载留言失败:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条留言吗？')) return
    try {
      await guestbookApi.deleteMessage(id)
      loadMessages()
    } catch (e) {
      console.error('删除留言失败:', e)
    }
  }

  return (
    <div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>留言管理</h1>
      </motion.div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>加载中...</div>
        ) : messages.length === 0 ? (
          <div className="app-card rounded-2xl p-8 text-center" style={{ color: 'var(--app-muted-text)' }}>暂无留言</div>
        ) : (
          messages.map((msg) => (
            <motion.div key={msg.id} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="app-card rounded-2xl p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold" style={{ background: 'var(--app-secondary)', color: 'var(--app-primary)' }}>
                    {msg.nickname[0]}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--app-text)' }}>{msg.nickname}</p>
                    <p className="text-xs" style={{ color: 'var(--app-muted-text)' }}>{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(msg.id)} className="rounded-lg p-1.5" style={{ color: '#F44336' }}>
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm" style={{ color: 'var(--app-text)' }}>{msg.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
