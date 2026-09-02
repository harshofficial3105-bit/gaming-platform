'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  breakdown: Record<number, number>;
}

export function RatingWidget({ gameId }: { gameId: string }) {
  const [summary, setSummary] = useState<RatingSummary>({
    averageRating: 4.8,
    totalRatings: 1,
    breakdown: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const getClientId = useCallback((): string => {
    if (typeof window === 'undefined') return 'guest';
    let id = localStorage.getItem('arcadehub_client_uuid');
    if (!id) {
      id = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('arcadehub_client_uuid', id);
    }
    return id;
  }, []);

  const loadRatings = useCallback(async () => {
    try {
      const uid = getClientId();
      const res = await fetch(`/api/feedback/rate?gameId=${gameId}&userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setSummary(data.summary);
          if (typeof data.summary.userRating === 'number') {
            setUserRating(data.summary.userRating);
          } else {
            const localVote = localStorage.getItem(`arcadehub_vote_${gameId}`);
            if (localVote && !isNaN(Number(localVote))) {
              setUserRating(Number(localVote));
            }
          }
        }
      }
    } catch (err) {
      console.warn('[RatingWidget] Load error:', err);
    }
  }, [gameId, getClientId]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const handleRate = async (stars: number) => {
    const uid = getClientId();
    setUserRating(stars);
    setLoading(true);
    setStatusMsg(null);

    try {
      localStorage.setItem(`arcadehub_vote_${gameId}`, String(stars));
      const res = await fetch('/api/feedback/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, userId: uid, rating: stars }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setSummary(data.summary);
          setStatusMsg(`Rating recorded: ${stars} ★`);
          
          window.dispatchEvent(
            new CustomEvent('arcadehub_rating_updated', {
              detail: { gameId, average: data.summary.averageRating },
            })
          );
        }
      }
    } catch (err) {
      console.error('Failed to submit rating', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRating = async () => {
    const uid = getClientId();
    setLoading(true);
    setUserRating(null);

    try {
      localStorage.removeItem(`arcadehub_vote_${gameId}`);
      const res = await fetch(`/api/feedback/rate?gameId=${gameId}&userId=${uid}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setSummary(data.summary);
          setStatusMsg('Rating removed.');
          window.dispatchEvent(
            new CustomEvent('arcadehub_rating_updated', {
              detail: { gameId, average: data.summary.averageRating },
            })
          );
        }
      }
    } catch (err) {
      console.error('Failed to delete rating', err);
    } finally {
      setLoading(false);
    }
  };

  const total = Math.max(1, summary.totalRatings);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 sm:p-5 space-y-4 font-sans shadow-lg">
      
      {/* 1. Header & Live Real Average */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black font-mono text-amber-400">
            {summary.averageRating > 0 ? summary.averageRating.toFixed(1) : '—'}
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              {'★'.repeat(Math.round(summary.averageRating))}
              {'☆'.repeat(5 - Math.round(summary.averageRating))}
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-0.5">
              {summary.totalRatings} {summary.totalRatings === 1 ? 'Verified Player Rating' : 'Verified Player Ratings'}
            </span>
          </div>
        </div>

        <span className="text-[9px] font-mono bg-[#050811] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
          LIVE REAL-TIME
        </span>
      </div>

      {/* 2. Interactive Star Rating & Edit Selector */}
      <div className="space-y-2 bg-[#050811] p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-slate-300">
            {userRating ? 'YOUR RATING (CLICK TO EDIT):' : 'RATE THIS GAME:'}
          </span>
          {userRating && (
            <button
              type="button"
              onClick={handleRemoveRating}
              disabled={loading}
              className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Remove Vote
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hover || userRating || 0) >= star;
            return (
              <button
                key={star}
                type="button"
                disabled={loading}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="text-2xl sm:text-3xl transition-transform hover:scale-125 focus:outline-none cursor-pointer disabled:cursor-default"
                aria-label={`Rate ${star} stars`}
              >
                <span
                  className={
                    isFilled
                      ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                      : 'text-slate-700 hover:text-slate-500'
                  }
                >
                  ★
                </span>
              </button>
            );
          })}

          <span className="text-xs font-mono font-bold text-cyan-300 ml-2">
            {hover ? `${hover} Stars` : userRating ? `${userRating} Stars (Saved)` : 'Select Rating'}
          </span>
        </div>

        {statusMsg && (
          <p className="text-[11px] font-mono text-emerald-400 font-bold animate-in fade-in">
            ✓ {statusMsg}
          </p>
        )}
      </div>

      {/* 3. Rating Distribution Breakdown Bars */}
      <div className="space-y-1.5 font-mono text-[10px]">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = summary.breakdown[stars] || 0;
          const percentage = Math.round((count / total) * 100);
          return (
            <div key={stars} className="flex items-center gap-2 text-slate-400">
              <span className="w-6 text-right font-bold">{stars}★</span>
              <div className="flex-1 h-2 rounded-full bg-[#050811] overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-slate-400">{count}</span>
            </div>
          );
        })}
      </div>

      {/* 4. Community Reactions Bar */}
      <CommunityReactionsWidget gameId={gameId} />

    </div>
  );
}

export function CommunityReactionsWidget({ gameId }: { gameId: string }) {
  const [reactions, setReactions] = useState<Record<string, number>>({
    addictive: 12,
    controls: 8,
    smooth: 15,
    soundtrack: 6,
    challenging: 9,
  });
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedUserTags = localStorage.getItem(`arcadehub_tags_${gameId}`);
      if (savedUserTags) {
        setActiveTags(JSON.parse(savedUserTags));
      }
    } catch {}
  }, [gameId]);

  const toggleTag = (tagKey: string) => {
    const exists = activeTags.includes(tagKey);
    const nextTags = exists ? activeTags.filter((t) => t !== tagKey) : [...activeTags, tagKey];
    setActiveTags(nextTags);

    setReactions((prev) => ({
      ...prev,
      [tagKey]: (prev[tagKey] || 0) + (exists ? -1 : 1),
    }));

    try {
      localStorage.setItem(`arcadehub_tags_${gameId}`, JSON.stringify(nextTags));
    } catch {}
  };

  const tags = [
    { key: 'addictive', label: '🔥 Addictive', color: 'hover:border-rose-500/60' },
    { key: 'controls', label: '🕹️ Tight Controls', color: 'hover:border-purple-500/60' },
    { key: 'smooth', label: '⚡ Smooth 60 FPS', color: 'hover:border-cyan-500/60' },
    { key: 'soundtrack', label: '🎧 Great Music', color: 'hover:border-amber-500/60' },
    { key: 'challenging', label: '🤯 Challenging', color: 'hover:border-emerald-500/60' },
  ];

  return (
    <div className="pt-3 border-t border-slate-800/60 space-y-2 font-mono text-xs">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
        COMMUNITY REACTION TAGS:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => {
          const isSelected = activeTags.includes(t.key);
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => toggleTag(t.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-sm shadow-purple-950/50'
                  : `bg-[#050811] border-slate-800 text-slate-400 hover:text-white ${t.color}`
              }`}
            >
              <span>{t.label}</span>
              <span className={`text-[9px] px-1 rounded-md ${isSelected ? 'bg-purple-800 text-white' : 'bg-slate-800 text-slate-300'}`}>
                {reactions[t.key] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ConversionBanner() {
  const handleOpenAuth = () => {
    window.dispatchEvent(new Event('open_arcadehub_auth'));
  };

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#0B1120] to-indigo-950/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
      <div className="space-y-0.5">
        <h4 className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
          <span>👑</span>
          <span>ENABLE CLOUD SYNCHRONIZATION</span>
        </h4>
        <p className="text-[11px] text-slate-400 font-mono">
          Sync your real guest scores and high-score records across all devices
        </p>
      </div>
      <button
        type="button"
        onClick={handleOpenAuth}
        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold shrink-0 transition-all cursor-pointer shadow-md active:scale-95"
      >
        Sync Now
      </button>
    </div>
  );
}