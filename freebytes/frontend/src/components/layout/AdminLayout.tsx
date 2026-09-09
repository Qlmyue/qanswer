import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  MessageSquare,
  BookOpen,
  Zap,
  Link2,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react'

const menuItems = [
  { path: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { path: '/admin/posts', label: '文章管理', icon: FileText },
  { path: '/admin/categories', label: '分类管理', icon: FolderTree },
  { path: '/admin/comments', label: '评论管理', icon: MessageSquare },
  { path: '/admin/guestbook', label: '留言管理', icon: BookOpen },
  { path: '/admin/danmaku', label: '弹幕管理', icon: Zap },
  { path: '/admin/friends', label: '友链管理', icon: Link2 },
  { path: '/admin/site', label: '站点设置', icon: Settings },
]

export default function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()

  // 未登录则跳转到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--app-bg)' }}>
      {/* 侧边栏 */}
      <aside
        className="fixed left-0 top-0 flex h-full w-64 flex-col border-r"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--app-border)',
        }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b px-6" style={{ borderColor: 'var(--app-border)' }}>
          <span className="text-2xl">🌙</span>
          <span className="font-bold" style={{ color: 'var(--app-text)' }}>管理后台</span>
        </div>

        {/* 菜单 */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm no-underline transition-colors"
                  style={{
                    color: isActive ? 'var(--app-primary)' : 'var(--app-muted-text)',
                    background: isActive ? 'var(--app-secondary)' : 'transparent',
                  }}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* 底部信息 */}
        <div className="border-t p-4" style={{ borderColor: 'var(--app-border)' }}>
          <div className="mb-3 flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
              style={{ background: 'var(--app-secondary)', color: 'var(--app-primary)' }}
            >
              {user?.nickname?.[0] || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                {user?.nickname || 'Admin'}
              </p>
              <p className="text-xs" style={{ color: 'var(--app-muted-text)' }}>
                {user?.role || '管理员'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs no-underline transition-colors"
              style={{ background: 'var(--app-muted)', color: 'var(--app-muted-text)' }}
            >
              <ChevronLeft size={14} />
              返回前台
            </Link>
            <button
              onClick={logout}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs transition-colors"
              style={{ background: 'var(--app-muted)', color: 'var(--app-muted-text)' }}
            >
              <LogOut size={14} />
              退出
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
