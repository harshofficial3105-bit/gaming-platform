export interface TelemetryEventRecord {
  id: string;
  gameId: string;
  eventType: 'game.start' | 'game.complete' | 'score.submit';
  durationSeconds?: number;
  score?: number;
  timestamp: number;
}

const telemetryEvents: TelemetryEventRecord[] = [];

export const telemetryStore = {
  recordEvent(event: Omit<TelemetryEventRecord, 'id' | 'timestamp'>): TelemetryEventRecord {
    const record: TelemetryEventRecord = {
      ...event,
      id: `tel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    telemetryEvents.push(record);
    return record;
  },

  getStats(gameId: string) {
    const gameEvents = telemetryEvents.filter((e) => e.gameId === gameId);
    const starts = gameEvents.filter((e) => e.eventType === 'game.start').length;
    const completes = gameEvents.filter((e) => e.eventType === 'game.complete').length;
    
    const durations = gameEvents
      .map((e) => e.durationSeconds)
      .filter((d): d is number => typeof d === 'number' && d > 0);

    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    return {
      gameId,
      totalPlays: Math.max(starts, 1),
      totalCompletions: completes,
      avgSessionSeconds: avgDuration > 0 ? avgDuration : 45,
    };
  },
};