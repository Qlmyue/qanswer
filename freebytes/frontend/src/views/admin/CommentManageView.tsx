import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Check, X } from 'lucide-react'
import type { Comment } from '@/types'
import { commentApi } from '@/services'
import { formatDate } from '@/utils/date'

export default function CommentManageView() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading] = useState(false)

  // 实际应该从 API 获取所有评论，这里简化处理
  useEffect(() => {
    // loadComments()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条评论吗？')) return
    try {
      await commentApi.deleteComment(id)
      setComments(prev => prev.filter(c => c.id !== id))
    } catch (e) {
      console.error('删除评论失败:', e)
    }
  }

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await commentApi.updateCommentStatus(id, status)
      setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    } catch (e) {
      console.error('更新状态失败:', e)
    }
  }

  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>评论管理</h1>
      </motion.div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>加载中...</div>
        ) : comments.length === 0 ? (
          <div className="app-card rounded-2xl p-8 text-center" style={{ color: 'var(--app-muted-text)' }}>
            暂无评论
          </div>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="app-card rounded-2xl p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: 'var(--app-secondary)', color: 'var(--app-primary)' }}
                  >
                    {comment.nickname[0]}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--app-text)' }}>{comment.nickname}</p>
                    <p className="text-xs" style={{ color: 'var(--app-muted-text)' }}>{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatus(comment.id, 'approved')}
                        className="rounded-lg p-1.5"
                        style={{ color: '#4CAF50' }}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleStatus(comment.id, 'rejected')}
                        className="rounded-lg p-1.5"
                        style={{ color: '#FF9800' }}
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="rounded-lg p-1.5"
                    style={{ color: '#F44336' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--app-text)' }}>{comment.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
