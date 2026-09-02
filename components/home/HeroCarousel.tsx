'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  bgGradient: string;
  icon: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: '100% Free • No Downloads • Instant Play',
    badgeColor: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-400',
    title: 'Play Instant Web Games\nin Your Browser.',
    description: 'Discover lightweight, high-performance HTML5 games optimized for both desktop and mobile. Zero installations, zero lag, pure gameplay.',
    ctaText: 'Browse All Games',
    ctaHref: '#all-games',
    bgGradient: 'from-cyan-950/40 via-slate-950 to-indigo-950/30',
    icon: '⚡',
  },
  {
    id: 2,
    badge: '🔥 Most Popular • #1 Trending',
    badgeColor: 'border-amber-500/40 bg-amber-950/40 text-amber-400',
    title: 'Space Gem Collector:\n60 FPS Cosmic Arcade.',
    description: 'Pilot your starship through deep space asteroid belts, dodge cosmic hazards, and harvest glowing energy crystals in silky 60 FPS.',
    ctaText: 'Play Space Gem Collector',
    ctaHref: '/games/space-gem-collector',
    bgGradient: 'from-amber-950/40 via-slate-950 to-cyan-950/30',
    icon: '🚀',
  },
  {
    id: 3,
    badge: '✨ Recently Added • Retro Arcade',
    badgeColor: 'border-purple-500/40 bg-purple-950/40 text-purple-400',
    title: 'Galaxy Shooter:\nAlien Invasions Await.',
    description: 'Defend planet Earth from waves of cybernetic alien invader fleets in this retro space blaster with screen-shaking particle effects.',
    ctaText: 'Play Galaxy Shooter',
    ctaHref: '/games/galaxy-shooter',
    bgGradient: 'from-purple-950/40 via-slate-950 to-indigo-950/30',
    icon: '👾',
  },
  {
    id: 4,
    badge: '⚡ Recently Added • High-Speed Action',
    badgeColor: 'border-pink-500/40 bg-pink-950/40 text-pink-400',
    title: 'Neon Runner:\nCyberpunk Rooftop Dash.',
    description: 'Sprint, slide, and wall-jump across neon skyscrapers in this 120 FPS adrenaline-fueled infinite cyber runner.',
    ctaText: 'Play Neon Runner',
    ctaHref: '/games/neon-runner',
    bgGradient: 'from-pink-950/40 via-slate-950 to-purple-950/30',
    icon: '🏃',
  },
  {
    id: 5,
    badge: '🌴 Recently Added • Puzzle Adventure',
    badgeColor: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400',
    title: 'Jungle Adventure:\nAncient Temple Ruins.',
    description: 'Swing across vines, trigger secret switches, and unearth ancient golden treasure idols in a vibrant tropical world.',
    ctaText: 'Play Jungle Adventure',
    ctaHref: '/games/jungle-adventure',
    bgGradient: 'from-emerald-950/40 via-slate-950 to-cyan-950/30',
    icon: '🤠',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950 shadow-2xl transition-all duration-700"
    >
      {/* Dynamic Background Glow Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-90 transition-all duration-700`} />
      
      {/* Decorative Star Particle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      {/* Main Slide Content */}
      <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 max-w-3xl space-y-6">
        
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold tracking-wide transition-all duration-500 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className={slide.badgeColor}>{slide.badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15] whitespace-pre-line drop-shadow-md">
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
          {slide.description}
        </p>

        {/* Action Button */}
        <div className="pt-2 flex items-center gap-4">
          <Link
            href={slide.ctaHref}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-xs sm:text-sm font-extrabold text-black shadow-lg shadow-cyan-500/25 hover:bg-cyan-300 hover:shadow-cyan-400/40 transition-all active:scale-95 cursor-pointer"
          >
            <span>{slide.ctaText}</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Navigation Controls: Arrows & Indicator Dots */}
      <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-4">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={prevSlide}
          title="Previous Slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all active:scale-90 cursor-pointer shadow-lg"
        >
          ←
        </button>

        {/* Indicator Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((s, index) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              title={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === index
                  ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-400/50'
                  : 'w-2.5 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={nextSlide}
          title="Next Slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all active:scale-90 cursor-pointer shadow-lg"
        >
          →
        </button>
      </div>
    </div>
  );
}
