'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginCreatorLocal } from '@/lib/creator/auth';

export default function CreatorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = loginCreatorLocal({ email, password });

      if (!result.success || !result.user) {
        setErrorMsg(result.error || 'Invalid creator email or password.');
        setLoading(false);
        return;
      }

      await fetch('/api/creator/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      router.push('/creator/dashboard');
    } catch (err) {
      console.error('Login error', err);
      setErrorMsg('Error signing in. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-sans">
      <div className="rounded-3xl border border-purple-500/30 bg-[#0B1120] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-400 text-2xl font-mono">
            🔐
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-display">
            Creator Studio Sign In
          </h1>
          <p className="text-xs text-slate-400">
            Access your published games, telemetry, and studio dashboard
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold block">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              placeholder="studio@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white placeholder-slate-500 outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold block">PASSWORD</label>
            <input
              type="password"
              required
              placeholder="Your studio password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white placeholder-slate-500 outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-purple-900/40 cursor-pointer text-xs"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN TO STUDIO →'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 font-mono text-xs text-slate-400 border-t border-slate-800/80">
          <span>New to ArcadeHub Creators? </span>
          <Link href="/creator/signup" className="text-purple-400 hover:text-purple-300 font-bold">
            Create Studio Account
          </Link>
        </div>

      </div>
    </div>
  );
}