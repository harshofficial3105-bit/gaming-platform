'use client';

import React, { useState, useEffect } from 'react';

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || activeEl?.tagName === 'IFRAME';
      if (isInput) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open_arcadehub_shortcuts', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open_arcadehub_shortcuts', handleOpenEvent);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K', desc: 'Open Command Palette & Global Search' },
    { key: 'Ctrl + B', desc: 'Toggle "My Games" Popover Library' },
    { key: 'Ctrl + J', desc: 'Jump to a Random ArcadeHub Portal' },
    { key: 'F', desc: 'Toggle Fullscreen Mode on Active Stage' },
    { key: 'M', desc: 'Mute / Unmute Game Audio' },
    { key: 'R', desc: 'Restart Current Game Session' },
    { key: 'ESC', desc: 'Close Active Popover, Modal, or Fullscreen' },
    { key: '?', desc: 'Toggle this Tactical Keyboard Guide' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg rounded-3xl border border-purple-500/40 bg-[#0B1120] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center h-8 w-8 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 font-mono font-bold text-sm">
              ⌨
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display text-white">
                Tactical Keyboard Shortcuts
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Fast navigation hotkeys across the ArcadeHub Grid
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-xl border border-slate-800 bg-[#050811] hover:border-rose-500/50 hover:text-rose-400 text-slate-400 font-bold transition-all cursor-pointer flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="grid grid-cols-1 gap-2.5 font-mono text-xs">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800/80 bg-[#050811] hover:border-purple-500/30 transition-colors"
            >
              <span className="text-slate-300 font-sans text-xs">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-[#0B1120] border border-slate-700 text-cyan-400 font-bold text-[11px] shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[#050811] border border-slate-800 text-slate-300">ESC</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[#050811] border border-slate-800 text-slate-300">?</kbd> to dismiss
        </div>

      </div>
    </div>
  );
}