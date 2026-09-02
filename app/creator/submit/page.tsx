'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ZipDropzone } from '@/components/developer/ZipDropzone';
import { GameCategory, GameOrientation } from '@/types/game';
import { getActiveCreator, addCreatorGame, CreatorUser } from '@/lib/creator/auth';

export default function SubmitGamePage() {
  const [creator, setCreator] = useState<CreatorUser | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<GameCategory>('action');
  const [orientation, setOrientation] = useState<GameOrientation>('landscape');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [developerName, setDeveloperName] = useState('');
  const [developerWebsite, setDeveloperWebsite] = useState('');
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveCreator();
    setCreator(active);
    if (active) {
      setDeveloperName(active.studioName);
    }
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipFile) {
      setError('Please upload your game .ZIP bundle.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('category', category);
      formData.append('orientation', orientation);
      formData.append('width', width.toString());
      formData.append('height', height.toString());
      formData.append('description', description);
      formData.append('controls', controls);
      formData.append('developerName', developerName || creator?.studioName || 'Independent Creator');
      formData.append('developerWebsite', developerWebsite);
      formData.append('bundle', zipFile);

      const res = await fetch('/api/developer/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed.');
      }

      // Associate game strictly with the authenticated creator
      if (creator) {
        addCreatorGame(creator.id, {
          title,
          slug,
          category,
          status: 'published',
        });
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error uploading game bundle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-mono text-white flex items-center gap-2">
            <span>📦</span>
            <span>INGEST GAME PACKAGE</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Automated ZIP Slip defense, AST security audit & live sandbox deployment
          </p>
        </div>

        <Link
          href="/creator/dashboard"
          className="text-xs font-mono text-slate-400 hover:text-white"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {submitSuccess ? (
        <div className="rounded-3xl border border-emerald-500/40 bg-emerald-950/20 p-8 text-center space-y-4 font-mono shadow-2xl">
          <div className="h-16 w-16 bg-emerald-950/80 border border-emerald-500/40 rounded-full flex items-center justify-center text-2xl mx-auto text-emerald-400">
            ✓
          </div>
          <h2 className="text-xl font-bold text-white">
            GAME BUNDLE VERIFIED & PUBLISHED
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your package passed all automated security checks and has been linked to your creator account.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/creator/dashboard"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md"
            >
              Go to Dashboard →
            </Link>
            <Link
              href={`/creator/preview?slug=${slug}`}
              className="px-5 py-2.5 rounded-xl border border-slate-800 bg-[#050811] hover:border-slate-700 text-slate-200 text-xs transition-colors"
            >
              Open in SDK Sandbox
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* 1. Metadata Form */}
          <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-5 space-y-4">
            <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              1. Game Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Cyber Glider 3D"
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none focus:border-purple-400 transition-colors font-sans text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">URL Slug:</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-purple-300 outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GameCategory)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none"
                >
                  <option value="action">Action</option>
                  <option value="arcade">Arcade</option>
                  <option value="puzzle">Puzzle</option>
                  <option value="racing">Racing</option>
                  <option value="sports">Sports</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Orientation:</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as GameOrientation)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none"
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <label className="text-slate-400">Description:</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Game overview and storyline..."
                className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none focus:border-purple-400 transition-colors font-sans text-xs placeholder-slate-600"
              />
            </div>

            <div className="space-y-1 text-xs font-mono">
              <label className="text-slate-400">Controls Breakdown:</label>
              <input
                type="text"
                required
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                placeholder="e.g. WASD to move, Spacebar to jump, Mouse to aim"
                className="w-full p-2.5 rounded-xl border border-slate-800 bg-[#050811] text-white outline-none focus:border-purple-400 transition-colors font-sans text-xs"
              />
            </div>
          </div>

          {/* 2. ZIP Dropzone */}
          <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-5 space-y-4">
            <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              2. HTML5 Game Bundle (.ZIP)
            </h2>
            <ZipDropzone onFileSelect={setZipFile} selectedFile={zipFile} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 font-mono text-xs">
            <Link
              href="/creator/dashboard"
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !zipFile}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Auditing & Ingesting...' : 'SUBMIT GAME PACKAGE →'}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
