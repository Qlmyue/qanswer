import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Send, MessageCircle } from 'lucide-react'
import type { GuestbookMessage } from '@/types'
import { guestbookApi } from '@/services'
import { formatDate } from '@/utils/date'

export default function Guestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    content: '',
  })

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const res = await guestbookApi.getMessages({ page: 1, pageSize: 50 })
      setMessages(res.items)
    } catch (e) {
      console.error('加载留言失败:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nickname.trim() || !formData.content.trim()) return

    try {
      await guestbookApi.createMessage({
        nickname: formData.nickname,
        email: formData.email || undefined,
        content: formData.content,
      })
      setFormData({ nickname: '', email: '', content: '' })
      loadMessages()
    } catch (e) {
      console.error('提交留言失败:', e)
    }
  }

  return (
    <div>
      {/* 标题 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 text-center"
      >
        <h1
          className="mb-2 text-3xl font-bold"
          style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
        >
          📪 留言板
        </h1>
        <p style={{ color: 'var(--app-muted-text)' }}>
          在这里留下你的足迹吧~
        </p>
      </motion.div>

      {/* 留言表单 */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="app-card mb-8 rounded-2xl p-6"
      >
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="昵称 *"
            value={formData.nickname}
            onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
            required
            className="rounded-xl border px-4 py-2.5 text-sm outline-none"
            style={{
              background: 'var(--app-muted)',
              borderColor: 'var(--app-border)',
              color: 'var(--app-text)',
            }}
          />
          <input
            type="email"
            placeholder="邮箱（选填）"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="rounded-xl border px-4 py-2.5 text-sm outline-none"
            style={{
              background: 'var(--app-muted)',
              borderColor: 'var(--app-border)',
              color: 'var(--app-text)',
            }}
          />
        </div>

        <textarea
          placeholder="写下你想说的话..."
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
          rows={4}
          className="mb-4 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none"
          style={{
            background: 'var(--app-muted)',
            borderColor: 'var(--app-border)',
            color: 'var(--app-text)',
          }}
        />

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: 'var(--app-primary)' }}
        >
          <Send size={14} />
          发表留言
        </button>
      </motion.form>

      {/* 留言列表 */}
      {loading ? (
        <div className="py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>
          加载中...
        </div>
      ) : messages.length === 0 ? (
        <div className="py-12 text-center">
          <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
          <p style={{ color: 'var(--app-muted-text)' }}>暂无留言，快来第一个留言吧~</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="app-card rounded-2xl p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: 'var(--app-secondary)', color: 'var(--app-primary)' }}
                  >
                    {msg.nickname[0]}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--app-text)' }}>
                      {msg.nickname}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--app-muted-text)' }}>
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="leading-relaxed" style={{ color: 'var(--app-text)' }}>
                  {msg.content}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
