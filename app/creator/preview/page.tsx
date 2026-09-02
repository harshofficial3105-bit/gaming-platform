'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllGames } from '@/lib/games';

interface LogEntry {
  id: string;
  time: string;
  direction: 'INCOMING' | 'OUTGOING';
  type: string;
  payload: Record<string, unknown>;
}

export default function CreatorPreviewPage() {
  const games = getAllGames();
  const [selectedGameUrl, setSelectedGameUrl] = useState(games[0]?.entryUrl || '/games/test-game/index.html');
  const [aspectMode, setAspectMode] = useState<'16/9' | '9/16' | '1/1'>('16/9');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const addLog = (direction: 'INCOMING' | 'OUTGOING', type: string, payload: Record<string, unknown>) => {
    const newEntry: LogEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString(),
      direction,
      type,
      payload,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    const handlePostMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type) {
        addLog('INCOMING', e.data.type, e.data);
      }
    };

    window.addEventListener('message', handlePostMessage);
    return () => window.removeEventListener('message', handlePostMessage);
  }, []);

  const dispatchMockEvent = (type: string, payload: Record<string, unknown>) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type, ...payload }, '*');
      addLog('OUTGOING', type, payload);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-purple-400">
            <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 font-bold">
              SDK SANDBOX v1.0
            </span>
            <span>•</span>
            <span className="text-slate-400">Live Telemetry & PostMessage Inspector</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
            Creator Live SDK Sandbox
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Link
            href="/creator/dashboard"
            className="px-4 py-2 rounded-xl border border-slate-800 bg-[#0B1120] hover:border-slate-700 text-slate-300 font-bold transition-colors"
          >
            ← Studio Dashboard
          </Link>
          <Link
            href="/creator/submit"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md"
          >
            + Upload Game
          </Link>
        </div>
      </div>

      {/* 2. Main Workspace: Game Stage + Inspector Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Game Canvas & Aspect Ratio Bar */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls Bar: Game Switcher & Viewport Mode */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-[#0B1120] p-3 text-xs font-mono">
            {/* Select Game */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">GAME:</span>
              <select
                value={selectedGameUrl}
                onChange={(e) => {
                  setSelectedGameUrl(e.target.value);
                  setLogs([]);
                }}
                className="bg-[#050811] border border-slate-800 rounded-lg px-2.5 py-1 text-white outline-none cursor-pointer"
              >
                {games.map((g) => (
                  <option key={g.id} value={g.entryUrl}>
                    {g.title} ({g.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio Switcher */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAspectMode('16/9')}
                className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
                  aspectMode === '16/9' ? 'bg-cyan-500 text-black' : 'bg-[#050811] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                16:9 Landscape
              </button>
              <button
                type="button"
                onClick={() => setAspectMode('9/16')}
                className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
                  aspectMode === '9/16' ? 'bg-cyan-500 text-black' : 'bg-[#050811] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                9:16 Portrait
              </button>
              <button
                type="button"
                onClick={() => setAspectMode('1/1')}
                className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
                  aspectMode === '1/1' ? 'bg-cyan-500 text-black' : 'bg-[#050811] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                1:1 Square
              </button>
            </div>
          </div>

          {/* Sandboxed Game Frame */}
          <div
            style={{
              aspectRatio: aspectMode === '16/9' ? '16 / 9' : aspectMode === '9/16' ? '9 / 16' : '1 / 1',
              maxHeight: '480px',
            }}
            className="relative w-full mx-auto overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl transition-all"
          >
            <iframe
              ref={iframeRef}
              src={`${selectedGameUrl}?v=${Date.now()}`}
              title="Creator Sandbox Game"
              className="h-full w-full border-0 block"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              allow="fullscreen; gamepad; autoplay"
            />
          </div>

          {/* Test Event Simulator Actions */}
          <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-slate-400 flex items-center gap-1.5 uppercase">
              <span>⚡</span>
              <span>SDK Event Dispatcher</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = !isMuted;
                  setIsMuted(next);
                  dispatchMockEvent('MUTE_AUDIO', { isMuted: next });
                }}
                className="rounded-xl border border-slate-700 bg-[#050811] px-3 py-1.5 font-bold text-slate-200 hover:text-white hover:border-cyan-400/50 active:scale-95 transition-all cursor-pointer"
              >
                {isMuted ? '🔊 Dispatch Unmute' : '🔇 Dispatch Mute'}
              </button>

              <button
                type="button"
                onClick={() => {
                  dispatchMockEvent('ARCADEHUB_LOAD_BEST_SCORE', {
                    gameId: 'test-game',
                    score: 9999,
                  });
                }}
                className="rounded-xl border border-slate-700 bg-[#050811] px-3 py-1.5 font-bold text-amber-300 hover:border-amber-400/50 active:scale-95 transition-all cursor-pointer"
              >
                🏆 Send Best Score (9,999 PTS)
              </button>

              <button
                type="button"
                onClick={() => {
                  if (iframeRef.current) {
                    iframeRef.current.src = `${selectedGameUrl}?v=${Date.now()}`;
                  }
                  setLogs([]);
                }}
                className="rounded-xl border border-slate-700 bg-[#050811] px-3 py-1.5 font-bold text-slate-200 hover:text-white active:scale-95 transition-all cursor-pointer"
              >
                🔄 Frame Reload
              </button>

              <button
                type="button"
                onClick={() => setLogs([])}
                className="rounded-xl border border-rose-500/30 bg-rose-950/30 px-3 py-1.5 font-bold text-rose-300 hover:bg-rose-900/40 active:scale-95 transition-all cursor-pointer ml-auto"
              >
                Clear Terminal
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Live SDK Event Terminal Inspector */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#070B14] p-5 space-y-4 shadow-2xl h-[580px] flex flex-col font-mono">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live PostMessage Stream
              </h3>
            </div>
            <span className="text-[10px] text-slate-500">
              {logs.length} Packets
            </span>
          </div>

          {/* Terminal Console Feed */}
          <div className="flex-1 overflow-y-auto text-[11px] space-y-2 pr-1 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2 p-6">
                <span className="text-3xl">📡</span>
                <p className="text-xs">Waiting for postMessage packets from game sandbox...</p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`rounded-xl p-2.5 border ${
                    log.direction === 'INCOMING'
                      ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-200'
                      : 'border-purple-500/30 bg-purple-950/20 text-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] pb-1 border-b border-slate-800/40">
                    <span className="font-bold">
                      {log.direction === 'INCOMING' ? '📥 RECV FROM GAME' : '📤 SENT TO GAME'}
                    </span>
                    <span className="text-slate-400">{log.time}</span>
                  </div>
                  <div className="pt-1.5 space-y-1">
                    <div className="font-bold text-white text-xs">{log.type}</div>
                    <pre className="text-[10px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}