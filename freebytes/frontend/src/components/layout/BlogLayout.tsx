import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function BlogLayout() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--app-bg)', backgroundAttachment: 'fixed' }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
