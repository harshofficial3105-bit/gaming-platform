'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function GlobalFeedbackModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [browserInfo, setBrowserInfo] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserInfo(`${navigator.userAgent.slice(0, 100)} (${window.innerWidth}x${window.innerHeight})`);
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open_arcadehub_feedback', handleOpen);
    return () => window.removeEventListener('open_arcadehub_feedback', handleOpen);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          subject,
          message,
          pageUrl: pathname || window.location.pathname,
          browserInfo,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setSubject('');
        setMessage('');
      }, 1800);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'suggestion', label: '💡 Feature Suggestion' },
    { id: 'ui', label: '🎨 UI / UX Feedback' },
    { id: 'general', label: '💬 General Thoughts' },
    { id: 'other', label: '⚙️ Other' },
  ];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0B1120] p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💬</span>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                ArcadeHub Platform Feedback
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Share suggestions, design feedback, or ideas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2 font-mono">
            <span className="text-3xl text-emerald-400">✓</span>
            <p className="text-sm text-emerald-400 font-bold">Feedback Sent Successfully!</p>
            <p className="text-xs text-slate-400">Thank you for helping us polish the platform.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {errorMsg && (
              <p className="text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2 rounded-xl">
                {errorMsg}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-slate-400 text-[11px] uppercase font-bold">Feedback Category</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFeedbackType(c.id)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                      feedbackType === c.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'border-slate-800 bg-[#050811] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] uppercase font-bold">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What is this feedback regarding?"
                className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none focus:border-cyan-400 transition-colors font-sans text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] uppercase font-bold">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts in detail..."
                className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none focus:border-cyan-400 transition-colors font-sans text-xs placeholder-slate-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}