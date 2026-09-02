'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerCreatorLocal } from '@/lib/creator/auth';

export default function CreatorSignupPage() {
  const router = useRouter();
  const [studioName, setStudioName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // Local persistent registration + API sync
      const result = registerCreatorLocal({
        studioName,
        fullName,
        email,
        password,
      });

      if (!result.success || !result.user) {
        setErrorMsg(result.error || 'Failed to create creator account.');
        setLoading(false);
        return;
      }

      // Sync with backend API
      await fetch('/api/creator/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studioName, fullName, email, password }),
      });

      // Redirect directly to creator dashboard
      router.push('/creator/dashboard');
    } catch (err) {
      console.error('Signup error', err);
      setErrorMsg('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 font-sans">
      <div className="rounded-3xl border border-purple-500/30 bg-[#0B1120] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-400 text-2xl font-mono">
            🛠️
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-display">
            Create Creator Account
          </h1>
          <p className="text-xs text-slate-400">
            Publish HTML5 games, track analytics, and manage your studio
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono text-center">
            {errorMsg}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold block">STUDIO / DEVELOPER NAME</label>
            <input
              type="text"
              required
              placeholder="e.g. Pixel Forge Studios"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white placeholder-slate-500 outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold block">YOUR FULL NAME</label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white placeholder-slate-500 outline-none focus:border-purple-400 transition-colors"
            />
          </div>

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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white placeholder-slate-500 outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold block">CONFIRM PASSWORD</label>
            <input
              type="password"
              required
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white placeholder-slate-500 outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-purple-900/40 cursor-pointer text-xs"
          >
            {loading ? 'CREATING STUDIO ACCOUNT...' : 'REGISTER CREATOR ACCOUNT →'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 font-mono text-xs text-slate-400 border-t border-slate-800/80">
          <span>Already have a creator account? </span>
          <Link href="/creator/login" className="text-purple-400 hover:text-purple-300 font-bold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}