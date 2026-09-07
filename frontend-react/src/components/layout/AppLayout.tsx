import { useState } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"

interface AppLayoutProps { children: React.ReactNode }

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  return <div className="app-shell min-h-screen"><Sidebar collapsed={isSidebarCollapsed} /><Navbar onToggleSidebar={() => setIsSidebarCollapsed((value) => !value)} collapsed={isSidebarCollapsed} /><main className={`min-h-screen pt-[88px] transition-[margin] duration-300 ${isSidebarCollapsed ? "md:ml-[76px]" : "md:ml-[250px]"}`}><div className="app-page px-5 pb-10 md:px-9 lg:px-11">{children}</div></main></div>
}
