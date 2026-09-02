'use client';

import { GamePortal } from './GamePortal';
import { ExtendedGame } from '@/lib/games';

export function GameCard({ game, priority = false }: { game: ExtendedGame; priority?: boolean }) {
  return <GamePortal game={game} priority={priority} />;
}