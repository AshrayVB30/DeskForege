"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, FileText, Loader2, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

export default function CreatePresentationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('Professional')
  const [slideCount, setSlideCount] = useState(10)
  const [file, setFile] = useState<File | null>(null)
  const [loadingText, setLoadingText] = useState('Generating your presentation...')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim() && !file) return
    setLoading(true)

    try {
      let documentText = ''
      
      // If a file is attached, upload and extract first
      if (file) {
        setLoadingText('Extracting document text...')
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        documentText = uploadRes.data.text
      }

      setLoadingText('Structuring content && Designing slides...')
      
      const payload = {
        title: prompt.slice(0, 30) || (file ? file.name : "Untitled Presentation"),
        prompt: prompt || `Create a presentation based on the uploaded document ${file?.name}`,
        document_text: documentText,
        slide_count: slideCount,
        tone: tone
      }

      const res = await api.post('/presentations/generate', payload)
      
      router.push(`/preview/${res.data.id}`)
    } catch (error) {
      console.error('Failed to generate:', error)
      alert("Failed to generate presentation. Check console for details.")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="bg-white p-10 rounded-2xl shadow-xl shadow-indigo-500/10 flex flex-col items-center gap-6 border border-slate-100 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">AI is at work ✨</h3>
            <p className="text-slate-500 text-sm">{loadingText}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Presentation</h1>
        <p className="text-slate-500">Provide a prompt or upload a document to let our AI build your deck.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          
          {/* Prompt Entry */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">What is your presentation about?</label>
            <textarea 
              className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none text-slate-700"
              placeholder="E.g. A Q3 marketing strategy overview emphasizing organic TikTok growth..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* File Upload Zone */}
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm p-8 text-center hover:bg-slate-50 transition-colors">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="text-indigo-600 font-semibold hover:underline">Click to upload</span> or drag and drop
                <p className="text-slate-500 text-sm mt-1">PDF, DOCX, or TXT up to 10MB</p>
              </div>
              {file && (
                <div className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" /> {file.name}
                </div>
              )}
            </label>
          </div>

        </div>

        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Tone / Style</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Professional">Professional</option>
                <option value="Startup Pitch">Startup Pitch</option>
                <option value="Technical">Technical</option>
                <option value="Casual">Casual / Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Number of Slides</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
                value={slideCount}
                onChange={(e) => setSlideCount(parseInt(e.target.value))}
              >
                <option value={5}>5 Slides</option>
                <option value={10}>10 Slides</option>
                <option value={15}>15 Slides</option>
                <option value={20}>20 Slides</option>
              </select>
            </div>

          </div>

          <button 
            disabled={!prompt.trim() && !file}
            onClick={handleGenerate}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate Presentation
          </button>
          
        </div>
      </div>
    </div>
  )
}
