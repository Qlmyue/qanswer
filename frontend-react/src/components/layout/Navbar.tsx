import { useEffect, useState } from "react"
import { Bell, ChevronDown, Menu, Moon, Settings, Sun, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/authStore"

interface NavbarProps { onToggleSidebar: () => void; collapsed: boolean }

export function Navbar({ onToggleSidebar, collapsed }: NavbarProps) {
  const { user, logout } = useAuthStore()
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark")
  const username = user?.username || "用户"
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); localStorage.setItem("theme", dark ? "dark" : "light") }, [dark])
  return <header className={`fixed right-0 top-0 z-30 flex h-[70px] items-center justify-between border-b border-border/70 bg-background/75 px-5 backdrop-blur-xl transition-[left] duration-300 md:px-9 ${collapsed ? "md:left-[76px]" : "md:left-[250px]"}`}><div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden h-9 w-9 rounded-xl md:inline-flex"><Menu className="h-[18px] w-[18px]" /></Button><p className="text-[11px] font-medium text-muted-foreground">工作台 / <span className="text-foreground">概览</span></p></div><div className="flex items-center gap-2.5"><Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border bg-card/70"><Bell className="h-4 w-4" /></Button><div className="flex h-9 items-center rounded-xl border border-border bg-card/70 p-1"><button aria-label="浅色模式" onClick={() => setDark(false)} className={`grid h-7 w-7 place-items-center rounded-lg transition ${!dark ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}><Sun className="h-3.5 w-3.5" /></button><button aria-label="深色模式" onClick={() => setDark(true)} className={`grid h-7 w-7 place-items-center rounded-lg transition ${dark ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}><Moon className="h-3.5 w-3.5" /></button></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="hidden h-10 gap-2 rounded-xl px-2 sm:flex"><span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#edb496] to-[#9c6963] text-[11px] font-bold text-white">{username.charAt(0).toUpperCase()}</span><span className="max-w-20 truncate text-xs font-semibold">{username}</span><ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44"><DropdownMenuItem><Settings className="mr-2 h-4 w-4" />个人设置</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500"><LogOut className="mr-2 h-4 w-4" />退出登录</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></header>
}
