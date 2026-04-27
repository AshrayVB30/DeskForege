"use client"
import React from 'react'
import Navbar from '@/components/layout/Navbar'
import { Sparkles, Image, Download, Zap, Shield, Cpu, Share2, MousePointer2, Layout } from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
  const features = [
    {
      title: "AI Narrative Structuring",
      desc: "Our GPT-4o powered engine doesn't just write text; it builds a story. It analyzes your input to create a logical flow from introduction to call-to-action.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "DALL-E 3 Visuals",
      desc: "Every slide gets a custom-generated, high-resolution illustration that matches your brand and the slide's specific context perfectly.",
      icon: <Image className="w-6 h-6" />,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Vector PPTX Export",
      desc: "Download fully editable PowerPoint files. No static images—every shape, text box, and icon remains editable in your favorite desktop app.",
      icon: <Download className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Real-time Refinement",
      desc: "Edit slides on the fly with our ultra-fast preview engine. Change a point, and the layout adjusts instantly with pixel-perfect precision.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Enterprise Security",
      desc: "Your data is encrypted at rest and in transit. We don't train our models on your private documents or proprietary presentations.",
      icon: <Shield className="w-6 h-6" />,
      color: "from-slate-700 to-slate-900"
    },
    {
      title: "GPU-Accelerated Rendering",
      desc: "Experience zero-lag editing. Our frontend is optimized for smooth transitions and instant previews, even with high-res assets.",
      icon: <Cpu className="w-6 h-6" />,
      color: "from-rose-500 to-red-600"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8">
            <Cpu className="w-3 h-3" /> System Capabilities
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight mb-8">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Impact.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            DeskForge combines the latest in LLM reasoning with high-performance vector rendering to create presentations that don't just look good—they work.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group relative p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity`} />
              
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg`}>
                {React.cloneElement(f.icon as React.ReactElement, { className: "w-6 h-6 text-white" })}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <div className="rounded-[2.5rem] bg-indigo-600 p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 shadow-2xl shadow-indigo-600/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            
            <div className="flex-1 relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">Ready to transform your workflow?</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-lg">
                Join thousands of professionals who have ditched manual slide formatting for DeskForge's intelligent automation.
              </p>
              <Link href="/auth/register">
                <button className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-xl text-lg uppercase tracking-widest">
                  Get Started Now
                </button>
              </Link>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 w-full lg:w-auto">
               <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center text-center">
                  <Share2 className="w-8 h-8 text-white mb-3" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Collaboration</span>
               </div>
               <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center text-center">
                  <MousePointer2 className="w-8 h-8 text-white mb-3" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Interactive</span>
               </div>
               <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center text-center">
                  <Layout className="w-8 h-8 text-white mb-3" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Smart Layouts</span>
               </div>
               <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center text-center">
                  <Cpu className="w-8 h-8 text-white mb-3" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">AI Engine</span>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="font-bold text-xl text-white">DeskForge</span>
          </div>
          <p className="text-sm tracking-tight">© 2026 DeskForge AI Inc. Crafted with precision.</p>
        </div>
      </footer>
    </div>
  )
}
