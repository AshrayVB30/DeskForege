"use client"
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import {
  Download, Edit3, Type, LayoutTemplate, Save, CheckCircle, Loader2,
  Play, X, ChevronLeft, ChevronRight, Maximize2
} from 'lucide-react'

interface Slide {
  title: string
  points: string[]
  image_url?: string
}

interface Presentation {
  id: string
  title: string
  slides: Slide[]
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

/* ─────────────────────────────────────────────
   PRESENTATION MODE OVERLAY
───────────────────────────────────────────── */
function PresentationMode({
  slides,
  startIndex,
  title,
  onClose,
}: {
  slides: Slide[]
  startIndex: number
  title: string
  onClose: () => void
}) {
  const [current, setCurrent] = useState(startIndex)
  const [animDir, setAnimDir] = useState<'in' | 'out'>('in')
  const total = slides.length

  const go = useCallback((dir: 1 | -1) => {
    setAnimDir('out')
    setTimeout(() => {
      setCurrent(c => Math.max(0, Math.min(total - 1, c + dir)))
      setAnimDir('in')
    }, 150)
  }, [total])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') go(1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1)
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, onClose])

  const slide = slides[current]

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-slate-900/80 backdrop-blur border-b border-white/5 shrink-0">
        <span className="text-white/40 text-sm font-medium tracking-wide">{title}</span>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm tabular-nums">
            {current + 1} <span className="text-white/20">/</span> {total}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
            title="Exit (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5 shrink-0">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <div
        className="flex-1 flex flex-col lg:flex-row items-center justify-center px-16 lg:px-32 py-12 overflow-hidden cursor-pointer gap-12"
        onClick={() => go(1)}
        style={{
          opacity: animDir === 'in' ? 1 : 0,
          transform: animDir === 'in' ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'opacity 150ms ease, transform 150ms ease',
        }}
      >
        <div className="flex-1">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-10 tracking-tight">
            {slide.title}
          </h1>
          <ul className="space-y-5">
            {slide.points.filter(Boolean).map((pt, i) => (
              <li key={i} className="flex gap-5 items-start">
                <span className="mt-3 w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
                <p className="text-xl sm:text-2xl text-white/75 leading-relaxed">{pt}</p>
              </li>
            ))}
          </ul>
        </div>
        {slide.image_url && (
          <div className="flex-1 max-w-2xl">
            <img 
              src={slide.image_url} 
              alt={slide.title} 
              className="w-full h-auto rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-white/5 shrink-0">
        <button
          onClick={() => go(-1)}
          disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCurrent(i) }}
              className={`rounded-full transition-all ${
                i === current ? 'w-6 h-2 bg-indigo-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          disabled={current === total - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-20 right-8 flex flex-col items-end gap-1 text-white/15 text-xs">
        <span>← → Navigate</span>
        <span>Space / Click — Next</span>
        <span>Esc — Exit</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function PreviewPage() {
  const { id } = useParams()
  const [data, setData] = useState<Presentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [presentMode, setPresentMode] = useState(false)
  const isInitialMount = useRef(true)

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const res = await api.get(`/presentations/${id}`)
        setData({ ...res.data, slides: res.data.content || [] })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPresentation()
  }, [id])

  // --- Live edit helpers ---
  const updateSlideTitle = (idx: number, value: string) => {
    setData(prev => {
      if (!prev) return prev
      const slides = prev.slides.map((s, i) => i === idx ? { ...s, title: value } : s)
      return { ...prev, slides }
    })
  }

  const updateSlidePoint = (slideIdx: number, pointIdx: number, value: string) => {
    setData(prev => {
      if (!prev) return prev
      const slides = prev.slides.map((s, i) => {
        if (i !== slideIdx) return s
        const points = s.points.map((p, j) => j === pointIdx ? value : p)
        return { ...s, points }
      })
      return { ...prev, slides }
    })
  }

  const addPoint = (slideIdx: number) => {
    setData(prev => {
      if (!prev) return prev
      const slides = prev.slides.map((s, i) =>
        i === slideIdx ? { ...s, points: [...s.points, ''] } : s
      )
      return { ...prev, slides }
    })
  }

  const removePoint = (slideIdx: number, pointIdx: number) => {
    setData(prev => {
      if (!prev) return prev
      const slides = prev.slides.map((s, i) =>
        i === slideIdx ? { ...s, points: s.points.filter((_, j) => j !== pointIdx) } : s
      )
      return { ...prev, slides }
    })
  }

  // --- Save ---
  const handleSave = useCallback(async () => {
    if (!data) return
    setSaveStatus('saving')
    try {
      await api.patch(`/presentations/${id}`, {
        title: data.title,
        content: data.slides,
      })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }, [data, id])

  useEffect(() => {
    if (!data || loading) return
    if (isInitialMount.current) { isInitialMount.current = false; return }
    const timer = setTimeout(handleSave, 1500)
    return () => clearTimeout(timer)
  }, [data]) 

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/export/ppt/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data?.title || 'presentation'}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert('Download failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <span className="text-slate-500 text-sm font-medium animate-pulse">Loading Workspace...</span>
        </div>
      </div>
    )
  }

  if (!data || !data.slides?.length) {
    return <div className="p-10 text-center text-slate-500 bg-slate-950 h-full flex items-center justify-center">Could not load presentation.</div>
  }

  const SaveIndicator = () => {
    if (saveStatus === 'saving') return (
      <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
        <Loader2 className="w-3 h-3 animate-spin" /> SYNCING...
      </span>
    )
    if (saveStatus === 'saved') return (
      <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
        <CheckCircle className="w-3 h-3" /> CHANGES SAVED
      </span>
    )
    if (saveStatus === 'error') return <span className="text-[10px] font-bold text-red-500">SAVE FAILED</span>
    return null
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden text-slate-200">
      {/* ── Presentation mode overlay ── */}
      {presentMode && (
        <PresentationMode
          slides={data.slides}
          startIndex={activeSlide}
          title={data.title}
          onClose={() => setPresentMode(false)}
        />
      )}

      {/* ── Header ── */}
      <header className="h-14 px-4 bg-slate-900 border-b border-white/5 flex items-center justify-between shrink-0 z-20 shadow-2xl">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 transition-colors cursor-default">
            <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
              <Type className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-bold text-white truncate max-w-[200px] lg:max-w-md">{data.title}</h1>
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <SaveIndicator />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-md text-xs font-semibold transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
          <button
            onClick={() => setPresentMode(true)}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-md text-xs font-semibold transition-all"
          >
            <Play className="w-3.5 h-3.5" /> Present
          </button>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-3.5 h-3.5" /> Export PPTX
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* 1. Sidebar - Outlines */}
        <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Slides</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{data.slides.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
            {data.slides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`group relative w-full rounded-lg transition-all duration-200 text-left p-3
                  ${activeSlide === idx 
                    ? 'bg-indigo-500/10 ring-1 ring-indigo-500/50' 
                    : 'hover:bg-white/5'}`}
              >
                <div className="flex gap-3 items-start">
                  <span className={`text-[10px] font-bold shrink-0 mt-0.5 ${activeSlide === idx ? 'text-indigo-400' : 'text-slate-600'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${activeSlide === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {slide.title || 'Untitled Slide'}
                    </p>
                    <p className="text-[10px] text-slate-600 truncate mt-0.5">
                      {slide.points.length} points
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* 2. Canvas - Central Area */}
        <section className="flex-1 relative bg-slate-950 flex flex-col overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="h-10 px-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Preview</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-600">Scale: 100%</span>
            </div>
          </div>

          {/* Slide Stage */}
          <div className="flex-1 overflow-auto p-8 lg:p-12 flex items-center justify-center scrollbar-hide">
             <div className="w-full max-w-[960px] aspect-video bg-white rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative group">
                {/* Fixed slide layout to prevent clipping */}
                <div className="absolute inset-0 p-[8%] flex flex-col lg:flex-row gap-[6%] items-center justify-center">
                  <div className="flex-1 min-w-0">
                    <div className="h-1.5 w-12 bg-indigo-500 rounded-full mb-6" />
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] mb-8 tracking-tight">
                      {data.slides[activeSlide]?.title || 'Slide Title'}
                    </h1>
                    <ul className="space-y-4">
                      {data.slides[activeSlide]?.points.map((pt, i) => (
                        <li key={i} className="flex gap-4 items-start">
                          <div className="mt-2.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                          <p className="text-lg lg:text-xl text-slate-700 font-medium leading-relaxed">{pt}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {data.slides[activeSlide]?.image_url && (
                    <div className="flex-1 w-full h-full max-h-[80%] flex items-center justify-center">
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-slate-50">
                        <img 
                          src={data.slides[activeSlide].image_url} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlays */}
                <div className="absolute bottom-6 right-8 text-[10px] font-black text-slate-200 uppercase tracking-widest select-none">
                  {activeSlide + 1} / {data.slides.length}
                </div>
             </div>
          </div>

          {/* Canvas Controls */}
          <div className="p-4 flex justify-center">
             <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1 rounded-full shadow-2xl">
               <button 
                 disabled={activeSlide === 0}
                 onClick={() => setActiveSlide(s => s - 1)}
                 className="p-2 rounded-full hover:bg-white/5 disabled:opacity-20 text-slate-400 hover:text-white transition-all"
               >
                 <ChevronLeft className="w-4 h-4" />
               </button>
               <span className="text-[10px] font-bold px-3 text-slate-400">{activeSlide + 1}</span>
               <button 
                 disabled={activeSlide === data.slides.length - 1}
                 onClick={() => setActiveSlide(s => s + 1)}
                 className="p-2 rounded-full hover:bg-white/5 disabled:opacity-20 text-slate-400 hover:text-white transition-all"
               >
                 <ChevronRight className="w-4 h-4" />
               </button>
             </div>
          </div>
        </section>

        {/* 3. Editor Panel - Refine Content */}
        <aside className="w-80 bg-slate-900 border-l border-white/5 flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inspector</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold uppercase tracking-tight">Slide Metadata</h2>
              </div>
              
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 ml-0.5">Title</label>
                <div className="relative group">
                  <Type className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    value={data.slides[activeSlide]?.title || ''}
                    onChange={e => updateSlideTitle(activeSlide, e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Content Input */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-white">
                <LayoutTemplate className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold uppercase tracking-tight">Content Points</h2>
              </div>

              <div className="space-y-3">
                {data.slides[activeSlide]?.points.map((pt, i) => (
                  <div key={i} className="group relative">
                    <textarea
                      className="w-full p-3 bg-slate-950 border border-white/5 rounded-lg text-xs text-slate-400 focus:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 min-h-[60px] resize-none transition-all scrollbar-hide"
                      value={pt}
                      onChange={e => updateSlidePoint(activeSlide, i, e.target.value)}
                    />
                    <button
                      onClick={() => removePoint(activeSlide, i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-xs text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                    >×</button>
                  </div>
                ))}
                <button
                  onClick={() => addPoint(activeSlide)}
                  className="w-full py-2.5 border border-dashed border-white/10 rounded-lg text-[10px] font-bold uppercase text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                >
                  + Add Point
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/50 border-t border-white/5">
             <div className="flex items-center gap-2 text-slate-600">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-medium italic">Auto-sync enabled</span>
             </div>
          </div>
        </aside>

      </main>
    </div>
  )
}
