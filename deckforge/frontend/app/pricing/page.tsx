import React from 'react'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-500">
            No hidden fees. No surprise charges. Choose the plan that best fits your workflow and start generating beautiful presentations instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          
          {/* Free Tier */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">Perfect for individuals trying out AI slide generation.</p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-500 text-lg">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-slate-700">
                <Check className="w-5 h-5 text-indigo-600 shrink-0" /> 3 AI Presentations / month
              </li>
              <li className="flex gap-3 text-slate-700">
                <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Max 10 slides per deck
              </li>
              <li className="flex gap-3 text-slate-700">
                <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Standard PPTX Export
              </li>
            </ul>
            <Link href="/auth/register">
              <button className="w-full py-3 bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                Get Started
              </button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-indigo-600 border border-indigo-500 rounded-3xl p-8 shadow-2xl shadow-indigo-600/30 flex flex-col h-[105%] relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-indigo-400 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-indigo-200 text-sm mb-6 flex-1">For professionals requiring unlimited access and customization.</p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-white">$19</span>
              <span className="text-indigo-200 text-lg">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-white">
                <Check className="w-5 h-5 text-cyan-400 shrink-0" /> Unlimited AI Presentations
              </li>
              <li className="flex gap-3 text-white">
                <Check className="w-5 h-5 text-cyan-400 shrink-0" /> Up to 50 slides per deck
              </li>
              <li className="flex gap-3 text-white">
                <Check className="w-5 h-5 text-cyan-400 shrink-0" /> Document parsing (PDF/DOCX)
              </li>
              <li className="flex gap-3 text-white">
                <Check className="w-5 h-5 text-cyan-400 shrink-0" /> Premium Corporate Templates
              </li>
            </ul>
            <Link href="/auth/register">
               <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-auto">
                 Try Pro Free <ArrowRight className="w-4 h-4" />
               </button>
            </Link>
          </div>

          {/* Team Tier */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Team</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">Custom solutions and shared workspaces for large teams.</p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-900">$49</span>
              <span className="text-slate-500 text-lg">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-slate-700">
                 <Check className="w-5 h-5 text-indigo-600 shrink-0" /> All Pro Features
              </li>
              <li className="flex gap-3 text-slate-700">
                 <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Custom Brand Kits & Logos
              </li>
              <li className="flex gap-3 text-slate-700">
                 <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Collaborative Editing
              </li>
            </ul>
            <button className="w-full py-3 bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
              Contact Sales
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}
