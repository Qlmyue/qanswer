import { useSiteStore } from '@/stores/siteStore'

export default function Footer() {
  const { config } = useSiteStore()

  return (
    <footer
      className="border-t py-12"
      style={{
        background: 'linear-gradient(180deg, rgba(255,245,247,0.5) 0%, rgba(240,244,255,0.5) 100%)',
        borderColor: 'var(--app-border)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        {/* 引言 */}
        <p
          className="mb-4 text-lg italic"
          style={{
            color: 'var(--app-muted-text)',
            fontFamily: '"Noto Serif SC", serif',
          }}
        >
          "钱塘江上潮信来，今日方知我是我"
        </p>

        {/* 分隔线 */}
        <div
          className="mx-auto mb-4 h-px w-32"
          style={{ background: 'var(--app-border)' }}
        />

        {/* 版权信息 */}
        <p className="text-sm" style={{ color: 'var(--app-muted-text)' }}>
          本网站由{' '}
          <span style={{ color: 'var(--app-primary)' }}>FreeBytes</span>{' '}
          强力驱动
        </p>

        {config?.icpNumber && (
          <p className="mt-2 text-xs" style={{ color: 'var(--app-muted-text)' }}>
            {config.icpNumber}
          </p>
        )}

        <p className="mt-2 text-xs" style={{ color: 'var(--app-muted-text)' }}>
          © {new Date().getFullYear()} 明月工作室 · 相信记录的力量
        </p>
      </div>
    </footer>
  )
}
