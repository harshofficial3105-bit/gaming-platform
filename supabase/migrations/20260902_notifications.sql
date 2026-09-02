-- ====================================================================================
-- ARCADEHUB DYNAMIC REAL-TIME NOTIFICATIONS SCHEMA (PRODUCTION)
-- ====================================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('rank_update', 'new_game', 'achievement', 'system', 'creator_update', 'admin_update')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ultra-fast lookup index for user notification feed & unread counter
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
    ON public.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
    ON public.notifications (user_id, is_read);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Users can ONLY view their own personal notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

-- 2. Users can ONLY update their own notifications (e.g. mark as read)
CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. Authenticated system and server API can insert notifications
CREATE POLICY "System and server can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

-- Enable Supabase Realtime for instant synchronization
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;