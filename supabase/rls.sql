-- ==============================================================================
-- ARCADEHUB: ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- STEP 1: ENABLE RLS ON ALL TABLES (Mandatory baseline)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 1. PUBLIC.PROFILES POLICIES
-- ==============================================================================

-- Anyone can view public profiles (needed for leaderboards and usernames)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Users can only update their OWN profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==============================================================================
-- 2. PUBLIC.GAMES POLICIES
-- ==============================================================================

-- Anyone can view published games in the catalog
CREATE POLICY "Games are viewable by everyone"
  ON public.games
  FOR SELECT
  USING (true);

-- Modifications (INSERT, UPDATE, DELETE) are locked by default
-- Only service role (backend admin) can modify games.

-- ==============================================================================
-- 3. PUBLIC.GAME_SAVES POLICIES
-- ==============================================================================

-- Players can only read their OWN save files
CREATE POLICY "Users can read their own game saves"
  ON public.game_saves
  FOR SELECT
  USING (auth.uid() = user_id);

-- Players can only insert save files for THEMSELVES
CREATE POLICY "Users can insert their own game saves"
  ON public.game_saves
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Players can only update their OWN save files
CREATE POLICY "Users can update their own game saves"
  ON public.game_saves
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Players can delete their OWN save files
CREATE POLICY "Users can delete their own game saves"
  ON public.game_saves
  FOR DELETE
  USING (auth.uid() = user_id);
