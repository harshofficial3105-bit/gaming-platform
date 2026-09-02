-- ====================================================================================
-- ARCADEHUB MASTER RBAC & RESOURCE OWNERSHIP RLS POLICIES (PRODUCTION HARDENED)
-- ====================================================================================

-- 1. Profiles & Roles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT DEFAULT '🤖',
    role TEXT NOT NULL DEFAULT 'PLAYER' CHECK (role IN ('GUEST', 'PLAYER', 'CREATOR', 'ADMIN')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch user role safely without triggering RLS infinite recursion
CREATE OR REPLACE FUNCTION public.get_auth_user_role(user_id UUID)
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Public profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- Users can update their own username/display_name/avatar, but CANNOT self-escalate role
CREATE POLICY "Users can update their profile metadata only" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND 
    role = public.get_auth_user_role(auth.uid()) -- Prevents infinite recursion while keeping role immutable
);

-- Users can insert their own profile on signup
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles FOR ALL 
USING (
    public.get_auth_user_role(auth.uid()) = 'ADMIN'
);

-- Automatic Auth Trigger: Automatically create public.profiles row on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'pilot_' || substr(new.id::text, 1, 6)),
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Pilot'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '🤖'),
    'PLAYER'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Creator Studios Table
CREATE TABLE IF NOT EXISTS public.creator_studios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    studio_name TEXT NOT NULL,
    bio TEXT,
    website_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.creator_studios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public creator studios are viewable by everyone" 
ON public.creator_studios FOR SELECT USING (true);

CREATE POLICY "Creators can manage their own studio" 
ON public.creator_studios FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Games Table with Strict Ownership Isolation & WITH CHECK Protections
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scanning', 'under_review', 'approved', 'published', 'rejected', 'suspended')),
    dimensions JSONB DEFAULT '{"width": 800, "height": 500}',
    orientation TEXT DEFAULT 'landscape',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- 3.1 Public can ONLY select games marked 'published' (Never drafts or scanning builds)
CREATE POLICY "Public can only view published games" 
ON public.games FOR SELECT 
USING (status = 'published');

-- 3.2 Creators can SELECT their own games in ANY status (draft, scanning, review, published)
CREATE POLICY "Creators can view their own games" 
ON public.games FOR SELECT 
USING (auth.uid() = creator_id);

-- 3.3 Creators can INSERT games ONLY if creator_id = auth.uid()
CREATE POLICY "Creators can insert their own games" 
ON public.games FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

-- 3.4 Creators can UPDATE their own games, but CANNOT reassign creator_id to another creator
CREATE POLICY "Creators can update their own games without changing creator_id" 
ON public.games FOR UPDATE 
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

-- 3.5 Creators can DELETE only their own games
CREATE POLICY "Creators can delete their own games" 
ON public.games FOR DELETE 
USING (auth.uid() = creator_id);

-- 3.6 Admins have unrestricted governance access to all games
CREATE POLICY "Admins have full access to all games" 
ON public.games FOR ALL 
USING (
    public.get_auth_user_role(auth.uid()) = 'ADMIN'
);

-- Performance Indexes for composite multi-tenant queries
CREATE INDEX IF NOT EXISTS idx_games_creator_id ON public.games(creator_id);
CREATE INDEX IF NOT EXISTS idx_games_slug ON public.games(slug);
CREATE INDEX IF NOT EXISTS idx_games_status ON public.games(status);