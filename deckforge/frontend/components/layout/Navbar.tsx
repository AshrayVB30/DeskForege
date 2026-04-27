"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Sparkles, ArrowRight } from "lucide-react"

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"))
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
             <span className="text-white font-bold text-xl leading-none">D</span>
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
            DeckForge
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Features
          </Link>
          <Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Templates
          </Link>
          <Link href="/resources" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Resources
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/register">
                 <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm">
                   Get Started <Sparkles className="w-4 h-4 text-indigo-400" />
                 </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
