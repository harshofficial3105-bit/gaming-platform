import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGames, getGameBySlug } from '@/lib/games';
import { GamePlayer } from '@/components/player/GamePlayer';

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 1. Pre-generate all game routes at build time (SSG)
export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

// 2. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: 'Game Not Found — ArcadeHub',
    };
  }

  return {
    title: `${game.title} — Play Online Free on ArcadeHub`,
    description: game.description,
  };
}

// 3. Dynamic Page View
export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  // If game slug does not exist, trigger Next.js 404 page
  if (!game) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/categories/${game.category}`} className="capitalize hover:text-cyan-400 transition-colors">
          {game.category}
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-medium">{game.title}</span>
      </nav>

      {/* Main Game Player Container */}
      <GamePlayer game={game} />

      {/* Game Details & Instructions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Left Column: Description & Controls */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {game.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              🕹️ How To Play / Controls
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {game.controls}
            </p>
          </div>
        </div>

        {/* Right Column: Game Metadata Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            Game Information
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="font-semibold uppercase text-cyan-400">{game.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Developer:</span>
              <span className="font-semibold text-white">{game.developer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Resolution:</span>
              <span className="text-slate-300">{game.dimensions.width} × {game.dimensions.height}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400 block mb-2">Tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
