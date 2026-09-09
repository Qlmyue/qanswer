import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Settings } from 'lucide-react'
import type { UpdateSiteConfigData } from '@/types'
import { siteApi } from '@/services'

export default function SiteConfigView() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<UpdateSiteConfigData>({
    siteName: '',
    siteSubtitle: '',
    siteDescription: '',
    logoUrl: '',
    bannerUrl: '',
    icpNumber: '',
    footerText: '',
  })

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const config = await siteApi.getConfig()
      setFormData({
        siteName: config.siteName,
        siteSubtitle: config.siteSubtitle,
        siteDescription: config.siteDescription,
        logoUrl: config.logoUrl || '',
        bannerUrl: config.bannerUrl || '',
        icpNumber: config.icpNumber || '',
        footerText: config.footerText || '',
      })
    } catch (e) {
      console.error('加载配置失败:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await siteApi.updateConfig(formData)
      alert('保存成功')
    } catch (e) {
      console.error('保存配置失败:', e)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
          <Settings size={24} style={{ color: 'var(--app-primary)' }} />
          站点设置
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          style={{ background: 'var(--app-primary)' }}
        >
          <Save size={14} />
          {saving ? '保存中...' : '保存'}
        </button>
      </motion.div>

      {loading ? (
        <div className="py-8 text-center" style={{ color: 'var(--app-muted-text)' }}>加载中...</div>
      ) : (
        <div className="space-y-6">
          <div className="app-card rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--app-text)' }}>基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>站点名称</label>
                <input type="text" value={formData.siteName} onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))} className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>副标题</label>
                <input type="text" value={formData.siteSubtitle} onChange={(e) => setFormData(prev => ({ ...prev, siteSubtitle: e.target.value }))} className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>站点描述</label>
                <textarea value={formData.siteDescription} onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))} rows={3} className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
              </div>
            </div>
          </div>

          <div className="app-card rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--app-text)' }}>图片设置</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>Logo URL</label>
                <input type="url" value={formData.logoUrl} onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))} placeholder="https://..." className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>Banner 背景图 URL</label>
                <input type="url" value={formData.bannerUrl} onChange={(e) => setFormData(prev => ({ ...prev, bannerUrl: e.target.value }))} placeholder="https://..." className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
              </div>
            </div>
          </div>

          <div className="app-card rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--app-text)' }}>其他设置</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>ICP 备案号</label>
                <input type="text" value={formData.icpNumber} onChange={(e) => setFormData(prev => ({ ...prev, icpNumber: e.target.value }))} className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--app-text)' }}>页脚文字</label>
                <input type="text" value={formData.footerText} onChange={(e) => setFormData(prev => ({ ...prev, footerText: e.target.value }))} className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ background: 'var(--app-muted)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
