import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Reply, Send } from 'lucide-react'
import type { Comment } from '@/types'
import { commentApi } from '@/services'
import { formatDate } from '@/utils/date'

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    content: '',
  })
  const [replyTo, setReplyTo] = useState<string | null>(null)

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    setLoading(true)
    try {
      const data = await commentApi.getComments(postId)
      setComments(data)
    } catch (e) {
      console.error('加载评论失败:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nickname.trim() || !formData.content.trim()) return

    try {
      await commentApi.createComment(postId, {
        nickname: formData.nickname,
        email: formData.email || undefined,
        content: formData.content,
        parentId: replyTo || undefined,
      })
      setFormData({ nickname: '', email: '', content: '' })
      setReplyTo(null)
      loadComments()
    } catch (e) {
      console.error('提交评论失败:', e)
    }
  }

  return (
    <div className="mt-8">
      <h3
        className="mb-6 flex items-center gap-2 text-lg font-bold"
        style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
      >
        <MessageCircle size={20} style={{ color: 'var(--app-primary)' }} />
        评论区 ({comments.length})
      </h3>

      {/* 评论表单 */}
      <form onSubmit={handleSubmit} className="app-card mb-8 rounded-2xl p-5">
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="昵称 *"
            value={formData.nickname}
            onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
            required
            className="rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors"
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
            className="rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors"
            style={{
              background: 'var(--app-muted)',
              borderColor: 'var(--app-border)',
              color: 'var(--app-text)',
            }}
          />
        </div>

        {replyTo && (
          <div className="mb-3 flex items-center gap-2 text-sm" style={{ color: 'var(--app-primary)' }}>
            <Reply size={14} />
            回复评论
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-xs underline"
            >
              取消
            </button>
          </div>
        )}

        <textarea
          placeholder="写下你的评论..."
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
          rows={4}
          className="mb-4 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
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
          发表评论
        </button>
      </form>

      {/* 评论列表 */}
      {loading ? (
        <div className="py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>
          加载中...
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>
          暂无评论，快来发表第一条吧~
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={setReplyTo}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function CommentItem({
  comment,
  onReply,
  depth = 0,
}: {
  comment: Comment
  onReply: (id: string) => void
  depth?: number
}) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      className="app-card rounded-2xl p-4"
      style={{ marginLeft: depth > 0 ? '2rem' : 0 }}
    >
      <div className="mb-2 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
          style={{ background: 'var(--app-secondary)', color: 'var(--app-primary)' }}
        >
          {comment.nickname[0]}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
            {comment.nickname}
          </p>
          <p className="text-xs" style={{ color: 'var(--app-muted-text)' }}>
            {formatDate(comment.createdAt)}
          </p>
        </div>
      </div>

      <p className="mb-2 text-sm leading-relaxed" style={{ color: 'var(--app-text)' }}>
        {comment.content}
      </p>

      <button
        onClick={() => onReply(comment.id)}
        className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
        style={{ color: 'var(--app-primary)' }}
      >
        <Reply size={12} />
        回复
      </button>

      {/* 回复列表 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
