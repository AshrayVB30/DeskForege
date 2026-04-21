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

      {/* Slide content */}
      <div
        className="flex-1 flex flex-col justify-center px-16 lg:px-32 py-12 overflow-hidden cursor-pointer"
        onClick={() => go(1)}
        style={{
          opacity: animDir === 'in' ? 1 : 0,
          transform: animDir === 'in' ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'opacity 150ms ease, transform 150ms ease',
        }}
      >
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

  // Auto-save with debounce, skip initial mount
  useEffect(() => {
    if (!data || loading) return
    if (isInitialMount.current) { isInitialMount.current = false; return }
    const timer = setTimeout(handleSave, 1500)
    return () => clearTimeout(timer)
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  // --- Download PPTX ---
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

  // --- Loading / error states ---
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  if (!data || !data.slides?.length) {
    return <div className="p-10 text-center text-slate-500">Could not load presentation.</div>
  }

  const SaveIndicator = () => {
    if (saveStatus === 'saving') return (
      <span className="flex items-center gap-1.5 text-xs text-slate-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
      </span>
    )
    if (saveStatus === 'saved') return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-600">
        <CheckCircle className="w-3.5 h-3.5" /> Saved
      </span>
    )
    if (saveStatus === 'error') return <span className="text-xs text-red-500">Save failed</span>
    return null
  }

  return (
    <>
      {/* ── Presentation mode overlay ── */}
      {presentMode && (
        <PresentationMode
          slides={data.slides}
          startIndex={activeSlide}
          title={data.title}
          onClose={() => setPresentMode(false)}
        />
      )}

      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">

        {/* Top Bar */}
        <div className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 truncate max-w-xs">{data.title}</h1>
            <SaveIndicator />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors hidden sm:flex"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            {/* Present button */}
            <button
              onClick={() => setPresentMode(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all hidden sm:flex"
            >
              <Play className="w-4 h-4 fill-white" /> Present
            </button>
            {/* Fullscreen icon for mobile */}
            <button
              onClick={() => setPresentMode(true)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition sm:hidden"
              title="Present"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-600/20 transition-all"
            >
              <Download className="w-4 h-4" /> Download PPTX
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Left — Thumbnails */}
          <div className="w-48 sm:w-56 border-r border-slate-200 bg-slate-50 p-4 flex flex-col gap-3 overflow-y-auto shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
              Slides ({data.slides.length})
            </h2>
            {data.slides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`relative aspect-video rounded-lg border-2 p-3 text-left overflow-hidden transition-all bg-white
                  ${activeSlide === idx ? 'border-indigo-600 shadow-sm' : 'border-slate-200 hover:border-indigo-300'}`}
              >
                <div className="absolute top-1.5 left-2 text-[10px] font-bold text-slate-400">{idx + 1}</div>
                <div className="mt-2 text-xs font-semibold text-slate-800 line-clamp-2">{slide.title || 'Untitled'}</div>
              </button>
            ))}
          </div>

          {/* Center — Canvas */}
          <div className="flex-1 bg-slate-100/50 flex py-8 px-4 sm:px-12 items-start justify-center overflow-y-auto">
            <div className="w-full max-w-4xl aspect-video bg-white shadow-2xl shadow-slate-200/50 border border-slate-200 rounded-xl flex flex-col p-8 sm:p-12 relative sticky top-0">
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                  {data.slides[activeSlide]?.title || <span className="text-slate-300 italic">No title</span>}
                </h1>
                <ul className="space-y-4">
                  {data.slides[activeSlide]?.points.map((pt, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="w-2 h-2 shrink-0 bg-indigo-500 rounded-full mt-2.5" />
                      <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">{pt}</p>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Slide counter + present hint */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setPresentMode(true)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Present from here
                </button>
                <span className="text-slate-300 font-bold text-sm">
                  {activeSlide + 1} / {data.slides.length}
                </span>
              </div>
            </div>
          </div>

          {/* Right — Edit Panel */}
          <div className="w-80 border-l border-slate-200 bg-white p-6 flex flex-col gap-5 overflow-y-auto shrink-0 hidden lg:flex">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Edit Slide {activeSlide + 1}</h2>
            </div>

            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Type className="w-4 h-4 text-slate-400" /> Slide Title
              </label>
              <input
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={data.slides[activeSlide]?.title || ''}
                onChange={e => updateSlideTitle(activeSlide, e.target.value)}
                placeholder="Slide title…"
              />
            </div>

            {/* Bullet points */}
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <LayoutTemplate className="w-4 h-4 text-slate-400" /> Bullet Points
              </label>
              <div className="space-y-2">
                {data.slides[activeSlide]?.points.map((pt, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <textarea
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[56px] resize-none transition"
                      value={pt}
                      onChange={e => updateSlidePoint(activeSlide, i, e.target.value)}
                      placeholder={`Point ${i + 1}…`}
                    />
                    <button
                      onClick={() => removePoint(activeSlide, i)}
                      className="mt-1 text-slate-300 hover:text-red-400 transition text-lg leading-none"
                      title="Remove"
                    >×</button>
                  </div>
                ))}
                <button
                  onClick={() => addPoint(activeSlide)}
                  className="w-full py-2 border border-dashed border-slate-300 hover:border-indigo-400 text-slate-400 hover:text-indigo-600 rounded-lg text-sm transition"
                >
                  + Add point
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center pt-4 border-t border-slate-100">
              Changes auto-save after 1.5 s of inactivity.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
