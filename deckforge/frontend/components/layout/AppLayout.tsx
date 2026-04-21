"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, FolderOpen, Settings, LogOut } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Create Presentation', href: '/create', icon: PlusCircle },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <span className="text-white font-bold text-xl leading-none">D</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">DeckForge</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href}>
                <span className={`\n                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200\n                  ${isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-zinc-800 dark:hover:text-slate-200'}\n                `}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-zinc-800">
          <Link href="/auth/login">
            <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
              Sign out
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
