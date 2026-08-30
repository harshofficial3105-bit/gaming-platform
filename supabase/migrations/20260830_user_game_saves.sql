-- ==============================================================================
-- USER GAME SAVES TABLE (Cross-Device Cloud Progress)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_game_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    save_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Enforce single save record per user per game (enables idempotent UPSERT)
    CONSTRAINT unique_user_game_save UNIQUE (user_id, game_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_game_saves_user_id ON public.user_game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_saves_game_id ON public.user_game_saves(game_id);
CREATE INDEX IF NOT EXISTS idx_user_game_saves_gin ON public.user_game_saves USING gin (save_data);

-- Enable Row-Level Security
ALTER TABLE public.user_game_saves ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Users can only read their own game saves
CREATE POLICY "Users can view own game saves"
    ON public.user_game_saves
    FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy 2: Users can insert or update their own game saves
CREATE POLICY "Users can upsert own game saves"
    ON public.user_game_saves
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
