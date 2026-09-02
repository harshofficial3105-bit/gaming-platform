'use client';

import React, { useState } from 'react';

interface ReportIssueButtonProps {
  gameId?: string;
  gameTitle?: string;
}

export function ReportIssueButton({ gameId = 'current-game', gameTitle }: ReportIssueButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [issueType, setIssueType] = useState('controls');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/feedback/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, issueType, description }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setDescription('');
      }, 1500);
    } catch (err) {
      console.error('Report submission error', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-[#050811] hover:border-amber-500/50 text-slate-400 hover:text-amber-300 text-xs font-mono transition-colors cursor-pointer"
      >
        <span>🐛</span>
        <span>Report a Problem</span>
      </button>

      {/* Tier 1 Game Bug Reporting Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#0B1120] p-6 shadow-2xl font-mono space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🐛</span>
                <span>REPORT A PROBLEM</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-2">
                <span className="text-2xl text-emerald-400">✓</span>
                <p className="text-xs text-emerald-400 font-bold">Problem report submitted successfully!</p>
                <p className="text-[10px] text-slate-400">Our engineering team has received the diagnostic report.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Target Game:</span>
                  <p className="text-slate-200 font-bold bg-[#050811] p-2 rounded-xl border border-slate-800">
                    {gameTitle || gameId}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] font-bold uppercase">Issue Type:</label>
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      { id: 'controls', label: '○ Controls Not Responding / Lag' },
                      { id: 'performance', label: '○ Performance / Frame Rate Drops' },
                      { id: 'mobile', label: '○ Mobile Touch / Display Glitch' },
                      { id: 'crash', label: '○ Game Crash / Blank Screen' },
                      { id: 'other', label: '○ Other Problem' },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                          issueType === opt.id
                            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                            : 'border-slate-800 bg-[#050811] text-slate-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="issueType"
                          value={opt.id}
                          checked={issueType === opt.id}
                          onChange={(e) => setIssueType(e.target.value)}
                          className="accent-amber-400"
                        />
                        <span>{opt.label.replace('○ ', '')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] font-bold uppercase">Description (Optional):</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what happened or steps to reproduce..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none placeholder-slate-600 font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
                  >
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}