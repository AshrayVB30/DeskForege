"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Download, Presentation as FilePresentation, Calendar, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'

interface Presentation {
  id: string
  title: string
  created_at: string
}

export default function Dashboard() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const res = await api.get('/presentations/')
        setPresentations(res.data)
      } catch (err) {
        console.error('Failed to load presentations', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPresentations()
  }, [])

  const handleDelete = async (p: Presentation) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    setDeletingId(p.id)
    try {
      await api.delete(`/presentations/${p.id}`)
      setPresentations(prev => prev.filter(x => x.id !== p.id))
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Workspace</h1>
          <p className="text-slate-500">Pick up right where you left off</p>
        </div>
        <Link href="/create">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all">
            <Plus className="w-5 h-5" />
            Create Presentation
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
             <div key={i} className="h-48 bg-white border border-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : presentations.length === 0 ? (
        <div className="bg-white border text-center border-slate-200 rounded-2xl p-12 flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FilePresentation className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No presentations yet</h3>
          <p className="text-slate-500 mt-2 mb-6">Create your first AI-generated slide deck now.</p>
          <Link href="/create">
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all">
              Get Started
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((p) => (
            <div key={p.id} className="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-full hover:shadow-xl hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                <FilePresentation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{p.title}</h3>
              <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-auto mb-4">
                <Calendar className="w-4 h-4" />
                {new Date(p.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <Link href={`/preview/${p.id}`} className="flex-1">
                  <button className="w-full justify-center flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                </Link>
                <button 
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token')
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/export/ppt/${p.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                      )
                      if (!res.ok) throw new Error('Export failed')
                      const blob = await res.blob()
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${p.title}.pptx`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    } catch { alert('Download failed.') }
                  }}
                  className="flex-1 justify-center flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" /> PPTX
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  disabled={deletingId === p.id}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40 shrink-0"
                  title="Delete presentation"
                >
                  {deletingId === p.id
                    ? <span className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                    : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
