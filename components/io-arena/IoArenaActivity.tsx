'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Users, Globe2, Zap, Server, ShieldCheck } from 'lucide-react';

export function IoArenaActivity() {
  const arenaNodes = [
    { id: 'node-us-east', region: 'US-East (N. Virginia)', status: 'Optimal', latency: '18ms', server: 'Cloudflare Edge Edge-01' },
    { id: 'node-eu-west', region: 'EU-West (Frankfurt)', status: 'Optimal', latency: '24ms', server: 'Cloudflare Edge Edge-04' },
    { id: 'node-ap-south', region: 'AP-South (Mumbai)', status: 'Optimal', latency: '12ms', server: 'Cloudflare Edge Edge-07' },
  ];

  return (
    <section className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-white/80 dark:bg-[#070B1F]/80 backdrop-blur-xl p-5 sm:p-7 shadow-xl shadow-indigo-950/5 dark:shadow-indigo-950/30 space-y-5 font-mono">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>ARENA LIVE MATCHMAKING & NODES</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            Global edge topology connecting browser players via low-latency WebSockets.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
          <Radio className="h-3 w-3" />
          <span>EDGE MESH ACTIVE</span>
        </span>
      </div>

      {/* Nodes Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        {arenaNodes.map((node) => (
          <div
            key={node.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A1028] border border-slate-200 dark:border-indigo-950/80 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">{node.region}</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{node.status}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Server className="h-3 w-3 text-indigo-400" />
                <span>{node.server}</span>
              </span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">{node.latency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Realtime Architecture Note */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-500/30 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-500" />
          <span>Realtime player mesh synchronized via Supabase Realtime Channels &amp; Edge Workers.</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Future-Ready Durable Architecture
        </span>
      </div>

    </section>
  );
}