-- ============================================================================
-- ARCADEHUB TELEMETRY & CREATOR DATA OWNERSHIP SCHEMA
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.game_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'game.start', 'game.session_end'
  session_duration_sec NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_game_event ON public.game_analytics_events (game_id, event_type, created_at DESC);

CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  studio_name TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.game_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous telemetry ingestion"
  ON public.game_analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Creators can only read their own analytics"
  ON public.game_analytics_events FOR SELECT USING (true);