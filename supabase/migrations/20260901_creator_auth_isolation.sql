-- ============================================================================
-- ARCADEHUB CREATOR AUTHENTICATION & MULTI-CREATOR DATA ISOLATION SCHEMA
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.creator_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published', -- 'published', 'under_review', 'draft'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creator_games_creator_id ON public.creator_games (creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_games_game_id ON public.creator_games (game_id);

ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_games ENABLE ROW LEVEL SECURITY;

-- Security Policy: Creators can only see and manage their own games
CREATE POLICY "Creators can view their own profile"
  ON public.creators FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Creators can view their own games"
  ON public.creator_games FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own games"
  ON public.creator_games FOR INSERT
  WITH CHECK (auth.uid() = creator_id);