-- ============================================================================
-- ARCADEHUB COMMUNITY REVIEWS & DIAGNOSTIC BUG REPORTING SCHEMA
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.game_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_reviews_game_id ON public.game_reviews (game_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.game_bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_bug_reports_game_id ON public.game_bug_reports (game_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.game_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_bug_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to game reviews"
  ON public.game_reviews FOR SELECT USING (true);

CREATE POLICY "Allow public insert to game reviews"
  ON public.game_reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert to bug reports"
  ON public.game_bug_reports FOR INSERT WITH CHECK (true);