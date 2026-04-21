"use client"
import React, { useEffect, useState } from 'react'
import { User, LogOut, CreditCard } from 'lucide-react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [user, setUser] = useState<{email: string, full_name: string} | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me')
        setUser(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/auth/login')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500">Manage your profile and subscription preferences.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
            </div>
            <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">Full Name</label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                {user ? user.full_name || 'N/A' : 'Loading...'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">Email Address</label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                {user ? user.email : 'Loading...'}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Current Plan</h2>
            </div>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-full uppercase tracking-wider">Free Tier</span>
          </div>
          <div className="p-6 flex items-center justify-between">
            <p className="text-slate-600 text-sm">You are currently on the Free plan. Upgrade to unlock more slide generations and advanced AI models.</p>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 font-medium rounded-lg text-sm transition-all hidden sm:block">
              Upgrade Plan
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
