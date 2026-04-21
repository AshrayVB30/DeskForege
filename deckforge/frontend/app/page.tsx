import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Sparkles, FileText, Download, ArrowRight, Layers, LayoutTemplate, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              DeckForge AI 2.0 is now live
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight lg:leading-[1.1] mb-8 max-w-4xl mx-auto">
              Turn ideas into professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">presentations in seconds</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop fighting with formatting. AI-powered slide generation designed for engineers, consultants, and teams who value their time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-lg">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center text-lg">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Demo Preview Mockup */}
        <section className="max-w-6xl mx-auto px-6 pb-32">
          <div className="rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm p-4 shadow-2xl overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
             <div className="aspect-[16/9] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative flex items-center justify-center">
                <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center animate-pulse">
                   <Sparkles className="w-10 h-10 text-indigo-600" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur rounded-xl border border-white flex justify-between items-center shadow-lg">
                   <div>
                     <p className="text-sm font-bold text-slate-900">Generating "Q3 Growth Strategy"...</p>
                     <p className="text-xs text-slate-500">Structuring slide 4 of 12</p>
                   </div>
                   <div className="hidden sm:flex gap-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-32 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Enterprise-grade presentations</h2>
              <p className="text-lg text-slate-500">Engineered to produce structured business flows and corporate-ready layouts without the hassle.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI Slide Generation</h3>
                <p className="text-slate-500 leading-relaxed">Turn bullet points, messy notes, or just a single topic constraint into a structured multi-slide narrative.</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Document Parsing</h3>
                <p className="text-slate-500 leading-relaxed">Upload massive PDFs or DOCX reports and let the AI extract and summarize the critical data directly.</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                  <LayoutTemplate className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Export</h3>
                <p className="text-slate-500 leading-relaxed">Ready to present immediately. Export flawlessly to editable PPTX vectors or flat PDF documents in one click.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block z-0"></div>
               
               <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-white border-4 border-slate-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-xl font-bold text-2xl">1</div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Provide Topic</h3>
                 <p className="text-slate-500">Enter your idea or drop a PDF file.</p>
               </div>
               
               <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-indigo-600 border-4 border-slate-50 text-white rounded-full flex items-center justify-center mb-6 shadow-xl font-bold text-2xl shadow-indigo-600/30">2</div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">AI Generates</h3>
                 <p className="text-slate-500">We structure and output raw slides.</p>
               </div>
               
               <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-white border-4 border-slate-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-xl font-bold text-2xl">3</div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Download</h3>
                 <p className="text-slate-500">Export as PPTX cleanly formatted.</p>
               </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="font-bold text-xl text-slate-900">DeckForge</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 DeckForge Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
