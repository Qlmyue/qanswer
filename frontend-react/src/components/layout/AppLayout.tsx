import { useState } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex pt-16">
        <Sidebar collapsed={isSidebarCollapsed} />
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            isSidebarCollapsed ? "ml-[72px]" : "ml-[240px]"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
