'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-10 pb-12 font-sans animate-pulse">
      
      {/* Top Hero Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="xl:col-span-7 h-[360px] sm:h-[420px] rounded-3xl bg-[#0B1120] border border-slate-800/80 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-6 w-32 rounded-full bg-slate-800" />
            <div className="h-10 w-3/4 rounded-xl bg-slate-800" />
            <div className="h-4 w-1/2 rounded-lg bg-slate-800" />
          </div>
          <div className="h-12 w-40 rounded-2xl bg-slate-800" />
        </div>

        <div className="xl:col-span-5 h-[360px] sm:h-[420px] rounded-3xl bg-[#0B1120] border border-slate-800/80 p-6 flex flex-col justify-between">
          <div className="h-6 w-40 rounded-full bg-slate-800" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 rounded-2xl bg-[#050811] border border-slate-800" />
            <div className="h-24 rounded-2xl bg-[#050811] border border-slate-800" />
            <div className="h-24 rounded-2xl bg-[#050811] border border-slate-800" />
            <div className="h-24 rounded-2xl bg-[#050811] border border-slate-800" />
          </div>
          <div className="h-4 w-48 rounded-lg bg-slate-800" />
        </div>
      </div>

      {/* Discovery Grid Skeletons */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
          <div className="h-8 w-48 rounded-xl bg-slate-800" />
          <div className="h-8 w-32 rounded-xl bg-slate-800" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-2xl sm:rounded-3xl bg-[#0B1120] border border-slate-800/80 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              <div className="absolute bottom-2.5 right-2.5 h-5 w-20 rounded-xl bg-slate-800" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}