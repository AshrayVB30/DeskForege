"use client"
import React from 'react'
import Navbar from '@/components/layout/Navbar'
import { BookOpen, FileText, PlayCircle, HelpCircle, MessageCircle, ExternalLink, ChevronRight } from 'lucide-react'

export default function ResourcesPage() {
  const articles = [
    { title: "Mastering AI Presentation Prompts", type: "Guide", time: "5 min read", img: "https://images.unsplash.com/photo-1456324504439-397657ca606a?q=80&w=2340&auto=format&fit=crop" },
    { title: "Effective Slide Design for Engineers", type: "Article", time: "8 min read", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2340&auto=format&fit=crop" },
    { title: "The Art of Data Storytelling", type: "Guide", time: "12 min read", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop" },
  ]

  const faqs = [
    { q: "How do I edit the generated slides?", a: "Once your presentation is generated, you can use the sidebar on the preview page to edit titles and points. All changes auto-sync to the server." },
    { q: "Can I use my own brand colors?", a: "Yes, you can customize themes in the Settings page or use our 'Tone/Style' selector during generation." },
    { q: "Is the PPTX file fully editable?", a: "Absolutely. Every element—text, shapes, and icons—is exported as a native PowerPoint object." },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8">
              <BookOpen className="w-3 h-3" /> Learning Hub
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight mb-8">Knowledge is <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Power.</span></h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">Level up your presentation game with our curated guides, tutorials, and deep-dives into the future of AI storytelling.</p>
          </div>

          {/* Featured Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {articles.map((art, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/5 bg-slate-900 mb-6 transition-all group-hover:border-indigo-500/30 group-hover:shadow-2xl group-hover:shadow-indigo-500/10">
                   <img src={art.img} alt={art.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500" />
                </div>
                <div className="px-2">
                   <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{art.type}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{art.time}</span>
                   </div>
                   <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight mb-4">{art.title}</h3>
                   <button className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-white transition-all uppercase tracking-widest">
                      Read More <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ & Support Section */}
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
               <h2 className="text-3xl font-black text-white mb-12 flex items-center gap-4">
                  <HelpCircle className="w-8 h-8 text-indigo-500" /> Frequently Asked
               </h2>
               <div className="space-y-8">
                  {faqs.map((faq, i) => (
                    <div key={i} className="space-y-3">
                       <h4 className="text-lg font-bold text-slate-200">{faq.q}</h4>
                       <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-8">
               <h2 className="text-3xl font-black text-white mb-12 flex items-center gap-4">
                  <MessageCircle className="w-8 h-8 text-indigo-500" /> Get Support
               </h2>
               <div className="p-8 rounded-[2rem] bg-indigo-500 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                  <div className="relative z-10">
                     <h3 className="text-2xl font-black text-white mb-4">Can't find what you're looking for?</h3>
                     <p className="text-indigo-100 mb-8 max-w-sm">Our support team is online 24/7 to help you with your presentation needs.</p>
                     <button className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl flex items-center gap-3 hover:bg-indigo-50 transition-all uppercase tracking-widest text-sm">
                        Contact Support <ExternalLink className="w-4 h-4" />
                     </button>
                  </div>
                  <HelpCircle className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 -rotate-12" />
               </div>
               
               <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
                        <PlayCircle className="w-7 h-7 text-indigo-400" />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-white mb-1 tracking-tight">Video Tutorials</h4>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Watch & Learn</p>
                     </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-indigo-500 transition-colors" />
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
          <p className="text-sm tracking-tight">© 2026 DeskForge AI Inc. Your success, documented.</p>
        </div>
      </footer>
    </div>
  )
}
