'use client';

import React, { useState, useEffect } from 'react';
import { playerAuth } from '@/lib/player/auth';

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setErrorMsg('');
      setSuccess(false);
    };
    window.addEventListener('open_arcadehub_auth', handleOpen);
    return () => window.removeEventListener('open_arcadehub_auth', handleOpen);
  }, []);

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    setOauthLoading(provider);
    setErrorMsg('');

    try {
      // Execute 1-Click OAuth connection
      await new Promise((resolve) => setTimeout(resolve, 600));
      playerAuth.signInWithProvider(provider);
      
      const providerLabel = provider === 'google' ? 'Google' : 'Facebook';
      setSuccessMessage(`Successfully authenticated via ${providerLabel}!`);
      setSuccess(true);

      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setOauthLoading(null);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(`Failed to connect with ${provider}.`);
      setOauthLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        if (!username.trim()) {
          setErrorMsg('Please choose a pilot username.');
          setLoading(false);
          return;
        }
        playerAuth.register(username, email);
        setSuccessMessage('Pilot Account Created Successfully!');
      } else {
        playerAuth.login(email);
        setSuccessMessage('Welcome back, Pilot!');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setUsername('');
        setEmail('');
        setPassword('');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-purple-500/40 bg-[#0B1120] p-6 sm:p-8 shadow-2xl shadow-purple-500/20 font-mono space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <h3 className="text-base font-bold text-white uppercase">
              {isSignUp ? 'Register Pilot Account' : 'Pilot Sign In'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-3">
            <span className="text-4xl">✓</span>
            <p className="text-sm text-emerald-400 font-bold">
              {successMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* 1. Google & Facebook OAuth Fast Actions */}
            <div className="space-y-2">
              
              {/* Google OAuth Button */}
              <button
                type="button"
                disabled={Boolean(oauthLoading) || loading}
                onClick={() => handleOAuthSignIn('google')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-700/80 bg-[#050811] hover:bg-slate-900 hover:border-cyan-400/50 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3 shadow-md disabled:opacity-60"
              >
                {oauthLoading === 'google' ? (
                  <span className="animate-spin text-sm">🔄</span>
                ) : (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{isSignUp ? 'Sign up with Google' : 'Continue with Google'}</span>
              </button>

              {/* Facebook OAuth Button */}
              <button
                type="button"
                disabled={Boolean(oauthLoading) || loading}
                onClick={() => handleOAuthSignIn('facebook')}
                className="w-full py-2.5 px-4 rounded-xl border border-[#1877F2]/40 bg-[#1877F2]/15 hover:bg-[#1877F2]/25 hover:border-[#1877F2] text-white font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3 shadow-md disabled:opacity-60"
              >
                {oauthLoading === 'facebook' ? (
                  <span className="animate-spin text-sm">🔄</span>
                ) : (
                  <svg className="h-4 w-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                <span>{isSignUp ? 'Sign up with Facebook' : 'Continue with Facebook'}</span>
              </button>

            </div>

            {/* 2. Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-[1px] flex-1 bg-slate-800" />
              <span className="text-[10px] text-slate-500 font-bold uppercase">
                Or Continue with Email
              </span>
              <div className="h-[1px] flex-1 bg-slate-800" />
            </div>

            {/* 3. Traditional Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {errorMsg && (
                <p className="text-rose-400 text-xs bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl">
                  {errorMsg}
                </p>
              )}

              {isSignUp && (
                <div className="space-y-1 text-left">
                  <label className="text-slate-300 text-[11px]">Pilot Username:</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. cyber_pilot"
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              )}

              <div className="space-y-1 text-left">
                <label className="text-slate-300 text-[11px]">Email Address:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pilot@arcadehub.com"
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-slate-300 text-[11px]">Password:</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading || Boolean(oauthLoading)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : isSignUp ? 'Create & Register Account' : 'Sign In'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg('');
                  }}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {isSignUp ? 'Already registered? Sign In' : 'New pilot? Register Account'}
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}