import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Zap } from 'lucide-react'
import type { Danmaku } from '@/types'
import { danmakuApi } from '@/services'
import { formatDate } from '@/utils/date'

export default function DanmakuManageView() {
  const [danmaku, setDanmaku] = useState<Danmaku[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDanmaku()
  }, [])

  const loadDanmaku = async () => {
    setLoading(true)
    try {
      const data = await danmakuApi.getDanmaku(100)
      setDanmaku(data)
    } catch (e) {
      console.error('加载弹幕失败:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条弹幕吗？')) return
    try {
      await danmakuApi.deleteDanmaku(id)
      loadDanmaku()
    } catch (e) {
      console.error('删除弹幕失败:', e)
    }
  }

  return (
    <div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
          <Zap size={24} style={{ color: '#E8A0BF' }} />
          弹幕管理
        </h1>
      </motion.div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>加载中...</div>
        ) : danmaku.length === 0 ? (
          <div className="app-card rounded-2xl p-8 text-center" style={{ color: 'var(--app-muted-text)' }}>暂无弹幕</div>
        ) : (
          danmaku.map((d) => (
            <motion.div key={d.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="app-card flex items-center justify-between rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                <span style={{ color: 'var(--app-text)' }}>{d.content}</span>
                <span className="text-xs" style={{ color: 'var(--app-muted-text)' }}>{d.nickname || '匿名'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: 'var(--app-muted-text)' }}>{formatDate(d.createdAt)}</span>
                <button onClick={() => handleDelete(d.id)} className="rounded-lg p-1.5" style={{ color: '#F44336' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
