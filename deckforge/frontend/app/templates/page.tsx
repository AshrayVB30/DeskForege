"use client"
import React from 'react'
import Navbar from '@/components/layout/Navbar'
import { LayoutGrid, TrendingUp, Presentation, Briefcase, GraduationCap, Code2, Rocket, Search } from 'lucide-react'

export default function TemplatesPage() {
  const categories = [
    { name: "Business", icon: <Briefcase className="w-4 h-4" />, count: 42 },
    { name: "Startups", icon: <Rocket className="w-4 h-4" />, count: 28 },
    { name: "Education", icon: <GraduationCap className="w-4 h-4" />, count: 15 },
    { name: "Technical", icon: <Code2 className="w-4 h-4" />, count: 22 },
  ]

  const templates = [
    { title: "Q3 Strategy Deck", category: "Business", views: "1.2k", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" },
    { title: "SaaS Pitch Deck 2026", category: "Startups", views: "3.4k", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop" },
    { title: "AI Research Overview", category: "Technical", views: "850", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2340&auto=format&fit=crop" },
    { title: "Product Roadmap", category: "Startups", views: "2.1k", img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2340&auto=format&fit=crop" },
    { title: "Investor Report", category: "Business", views: "4.5k", img: "https://images.unsplash.com/photo-1454165833762-01049369290d?q=80&w=2340&auto=format&fit=crop" },
    { title: "Marketing Campaign", category: "Business", views: "1.8k", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2148&auto=format&fit=crop" },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">
                <LayoutGrid className="w-3 h-3" /> Template Gallery
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">Start with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Winning Edge.</span></h1>
              <p className="text-slate-400 text-lg leading-relaxed">Choose from dozens of professionally curated structures, or let AI build a custom one from scratch.</p>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="pl-12 pr-6 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full md:w-80 transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs transition-all shadow-lg">All Templates</button>
            {categories.map((cat, i) => (
              <button key={i} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-bold text-xs hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((temp, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/5 bg-slate-900 mb-5 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-indigo-500/20 group-hover:border-indigo-500/30">
                  <img src={temp.img} alt={temp.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                        <TrendingUp className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{temp.views}</span>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-indigo-600/50">
                        <Presentation className="w-5 h-5 text-white" />
                     </div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 px-2">{temp.title}</h3>
                <p className="text-xs text-slate-500 px-2 font-bold uppercase tracking-widest">{temp.category}</p>
              </div>
            ))}
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
          <p className="text-sm tracking-tight">© 2026 DeskForge AI Inc. Choose your path to success.</p>
        </div>
      </footer>
    </div>
  )
}
