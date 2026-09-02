'use client';

import { trophyEngine, EvaluatedTrophy } from '@/lib/trophies';

export type Achievement = EvaluatedTrophy;

export function evaluateAchievements(): Achievement[] {
  return trophyEngine.evaluateTrophies().trophies;
}