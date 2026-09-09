import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/', label: '首页', emoji: '🏡' },
  { path: '/category/技术博客', label: '技术博客', emoji: '📝' },
  { path: '/category/寥寥随笔', label: '随笔', emoji: '🖊️' },
  { path: '/archive', label: '归档', emoji: '📚' },
  { path: '/guestbook', label: '留言', emoji: '📪' },
  { path: '/friends', label: '友链', emoji: '🔗' },
  { path: '/about', label: '关于', emoji: '✨' },
]

export default function Header() {
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--app-border)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">🌙</span>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
            >
              明月工作室
            </span>
          </Link>

          {/* 导航菜单 */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative rounded-xl px-3 py-2 text-sm no-underline transition-colors"
                  style={{
                    color: isActive ? 'var(--app-primary)' : 'var(--app-muted-text)',
                    background: isActive ? 'var(--app-secondary)' : 'transparent',
                  }}
                >
                  <span className="mr-1">{item.emoji}</span>
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: 'var(--app-primary)' }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* 搜索按钮 */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文章..."
                  autoFocus
                  className="rounded-xl border px-3 py-1.5 text-sm outline-none"
                  style={{
                    background: 'var(--app-muted)',
                    borderColor: 'var(--app-border)',
                    width: '200px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-xl p-2 transition-colors hover:opacity-70"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-xl p-2 transition-colors hover:opacity-70"
                style={{ color: 'var(--app-muted-text)' }}
              >
                <Search size={18} />
              </button>
            )}

            {/* 移动端菜单按钮 */}
            <button
              className="rounded-xl p-2 md:hidden"
              style={{ color: 'var(--app-muted-text)' }}
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
