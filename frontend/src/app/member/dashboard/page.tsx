'use client';

import Link from 'next/link';
import { ShoppingCart, Users, TrendingUp, BarChart3 } from 'lucide-react';

export default function MemberDashboard() {
  // Mock data for MTD ring
  const mtdTarget = 150000;
  const mtdActual = 87500;
  const mtdPct = Math.round((mtdActual / mtdTarget) * 100);
  const circumference = 2 * Math.PI * 54; // r=54
  const strokeOffset = circumference - (mtdPct / 100) * circumference;

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales Hub</h1>
          <p className="text-neutral-400 mt-1">Welcome back. Here&apos;s your pipeline at a glance.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* MTD Revenue Ring */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 flex flex-col items-center">
          <svg width="128" height="128" viewBox="0 0 128 128" className="mb-3">
            <circle cx="64" cy="64" r="54" fill="none" stroke="#262626" strokeWidth="10" />
            <circle
              cx="64" cy="64" r="54" fill="none"
              stroke={mtdPct >= 80 ? '#22c55e' : mtdPct >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              transform="rotate(-90 64 64)"
              className="transition-all duration-1000"
            />
            <text x="64" y="58" textAnchor="middle" className="fill-white text-2xl font-bold" fontSize="22">{mtdPct}%</text>
            <text x="64" y="78" textAnchor="middle" className="fill-neutral-400" fontSize="10">of target</text>
          </svg>
          <div className="text-center">
            <p className="text-xl font-bold text-white">AED {mtdActual.toLocaleString()}</p>
            <p className="text-xs text-neutral-500">MTD Revenue / {mtdTarget.toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 flex flex-col justify-between">
          <p className="text-neutral-400 text-sm">Open Quotes</p>
          <p className="text-4xl font-bold text-amber-400 my-2">12</p>
          <p className="text-xs text-neutral-500">3 expiring this week</p>
        </div>
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 flex flex-col justify-between">
          <p className="text-neutral-400 text-sm">Active Deals</p>
          <p className="text-4xl font-bold text-blue-400 my-2">8</p>
          <p className="text-xs text-neutral-500">2 in negotiation</p>
        </div>
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 flex flex-col justify-between">
          <p className="text-neutral-400 text-sm">Commission (MTD)</p>
          <p className="text-4xl font-bold text-green-400 my-2">AED 4,375</p>
          <p className="text-xs text-neutral-500">5% of closed revenue</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/member/cart" className="block group">
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 hover:border-amber-500 transition-all hover:shadow-amber-500/10 hover:shadow-xl h-full">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-black transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Quick Quote Cart</h2>
            <p className="text-neutral-400 text-sm">Build quotes fast with the Fast-Food style B2B basket. Alt+A to add items instantly.</p>
          </div>
        </Link>

        <Link href="/member/clients" className="block group">
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 hover:border-blue-500 transition-all hover:shadow-blue-500/10 hover:shadow-xl h-full">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-black transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">CRM &amp; Clients</h2>
            <p className="text-neutral-400 text-sm">360° client profiles, credit tracking, and lead temperature management.</p>
          </div>
        </Link>

        <Link href="/member/pipeline" className="block group">
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 hover:border-green-500 transition-all hover:shadow-green-500/10 hover:shadow-xl h-full">
            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-black transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Sales Pipeline</h2>
            <p className="text-neutral-400 text-sm">Drag deals through your personal Kanban. Track win rate and commissions.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
