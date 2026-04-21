"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)
      
      const res = await api.post('/auth/login', formData)
      localStorage.setItem('token', res.data.access_token)
      router.push('/dashboard')
    } catch (err) {
      alert("Login failed. Check your credentials.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl shadow-indigo-600/10 p-10 border border-slate-200">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-600/20">
              <span className="text-white font-bold text-2xl leading-none">D</span>
           </div>
           <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
           <p className="text-slate-500 text-sm">Sign in to your DeckForge account.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
             <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="name@company.com" />
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
             <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
           </div>
           <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all mt-4">
             Sign In
           </button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-8">
           Don't have an account? <Link href="/auth/register" className="text-indigo-600 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}
