import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getGameBySlug, getAllGames } from '@/lib/games';
import { GamePlayer } from '@/components/player/GamePlayer';
import { Leaderboard } from '@/components/game/Leaderboard';
import { RatingWidget } from '@/components/game/GameInteractiveWidgets';
import { CompatibilityBadges } from '@/components/game/CompatibilityBadges';
import { ReportIssueButton } from '@/components/game/ReportIssueButton';
import { GamePortal } from '@/components/ui/GamePortal';

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: 'Game Not Found — ArcadeHub',
      description: 'The requested game could not be found.',
    };
  }

  return {
    title: `${game.title} — Play Free on ArcadeHub`,
    description: game.description,
    openGraph: {
      title: `${game.title} — ArcadeHub`,
      description: game.description,
      images: [
        {
          url: game.thumbnailUrl,
          width: 800,
          height: 500,
          alt: game.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: game.title,
      description: game.description,
      images: [game.thumbnailUrl],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const allGames = getAllGames();
  const relatedGames = allGames.filter((g) => g.id !== game.id).slice(0, 6);

  // Dynamic width constraints
  const gameWidth = game.dimensions?.width || 800;
  const maxStageWidth = Math.min(Math.max(gameWidth, 800), 1020);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    genre: game.category,
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    image: game.thumbnailUrl,
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Tactical Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span>⚡ THE GRID</span>
          </Link>
          <span>/</span>
          <span className="uppercase text-cyan-400 font-bold">{game.category}</span>
          <span>/</span>
          <span className="text-slate-200 font-bold">{game.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-mono text-[11px]">GAME READY</span>
        </div>
      </div>

      {/* 2. GAME HEADER: Title + Compatibility */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
            <span>{game.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            {game.description}
          </p>
        </div>

        <div className="shrink-0">
          <CompatibilityBadges game={game} />
        </div>
      </div>

      {/* 3. CENTERED DYNAMIC-RATIO GAMING STAGE (WITH UNIFIED INTEGRATED CONTROLS) */}
      <div className="flex flex-col items-center justify-center w-full space-y-2">
        <div
          className="w-full rounded-3xl border border-slate-800/90 bg-[#050811] p-3 sm:p-4 shadow-2xl transition-all"
          style={{
            maxWidth: `${maxStageWidth}px`,
          }}
        >
          <GamePlayer game={game} />
        </div>

        {/* Diagnostic & Bug Reporting Tool directly below stage */}
        <div
          className="w-full flex items-center justify-end pt-1 px-1"
          style={{ maxWidth: `${maxStageWidth}px` }}
        >
          <ReportIssueButton gameId={game.id} gameTitle={game.title} />
        </div>
      </div>

      {/* 4. GAME DETAILS & COMMUNITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2 max-w-6xl mx-auto">
        
        {/* Left 2 Cols: Controls & Description */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-5 shadow-lg space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
              <span>🎮</span>
              <span>How To Play & Controls</span>
            </h2>
            <div className="rounded-xl border border-slate-800 bg-[#050811] p-3.5 text-xs text-slate-300 font-mono leading-relaxed">
              {game.controls}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {game.description}
            </p>
          </div>

          {/* Anti-Cheat Leaderboard */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 font-mono">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🏆</span>
                <span>Global Hall of Fame</span>
              </h2>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                ANTI-CHEAT VERIFIED
              </span>
            </div>
            <Leaderboard gameId={game.id} />
          </div>
        </div>

        {/* Right 1 Col: Rating & Specifications */}
        <div className="space-y-4">
          
          {/* Rating */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-5 shadow-lg space-y-3">
            <h3 className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
              <span>⭐</span>
              <span>Player Rating</span>
            </h3>
            <RatingWidget gameId={game.id} />
          </div>

          {/* Specs */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-5 shadow-lg space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase">
              <span>⚡</span>
              <span>Game Specifications</span>
            </h3>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex justify-between">
                <span>Resolution:</span>
                <span className="text-slate-200">{game.dimensions?.width || 800} × {game.dimensions?.height || 500}</span>
              </div>
              <div className="flex justify-between">
                <span>Orientation:</span>
                <span className="text-slate-200 capitalize">{game.orientation}</span>
              </div>
              <div className="flex justify-between">
                <span>Target FPS:</span>
                <span className="text-cyan-400 font-bold">60 FPS</span>
              </div>
              <div className="flex justify-between">
                <span>Session Time:</span>
                <span className="text-slate-200">~{game.playTimeMinutes || 3} min</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. Related Games Stream */}
      {relatedGames.length > 0 && (
        <section className="space-y-3 pt-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 px-1 font-mono">
            <h2 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <span>⚡ Related Portals</span>
            </h2>
            <Link href="/#explore" className="text-xs text-cyan-400 hover:text-cyan-300">
              View All Games →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {relatedGames.map((relatedGame) => (
              <GamePortal key={relatedGame.id} game={relatedGame} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}