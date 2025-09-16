-- Clean StoryTeller Database Schema for Supabase
-- Run this entire script in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_tier TEXT DEFAULT 'free',
    stories_created INTEGER DEFAULT 0,
    stories_limit INTEGER DEFAULT 5
);

-- Stories table
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    theme TEXT NOT NULL,
    art_style TEXT NOT NULL,
    character_name TEXT,
    character_age INTEGER,
    character_gender TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'failed')),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_at TIMESTAMP WITH TIME ZONE,
    word_count INTEGER DEFAULT 0,
    reading_time_minutes INTEGER DEFAULT 0
);

-- Chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    illustration_url TEXT,
    illustration_prompt TEXT,
    illustration_style TEXT,
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, chapter_number)
);

-- Illustrations table
CREATE TABLE IF NOT EXISTS public.illustrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    prompt TEXT NOT NULL,
    style TEXT NOT NULL,
    generation_params JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_size INTEGER,
    dimensions JSONB
);

-- PDFs table
CREATE TABLE IF NOT EXISTS public.pdfs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version TEXT DEFAULT '1.0',
    is_latest BOOLEAN DEFAULT true
);

-- Story tags for categorization
CREATE TABLE IF NOT EXISTS public.story_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, tag)
);

-- User favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, story_id)
);

-- Story generation logs with Replicate integration
CREATE TABLE IF NOT EXISTS public.generation_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    -- Replicate integration fields
    replicate_prediction_id TEXT,
    output_url TEXT,
    model_name TEXT DEFAULT 'dreamshaper-xl-turbo',
    model_version TEXT DEFAULT 'latest'
);

-- AI model usage tracking for Replicate
CREATE TABLE IF NOT EXISTS public.ai_model_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    images_generated INTEGER DEFAULT 0,
    cost_usd DECIMAL(10,6) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON public.stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories(created_at);
CREATE INDEX IF NOT EXISTS idx_stories_status ON public.stories(status);
CREATE INDEX IF NOT EXISTS idx_chapters_story_id ON public.chapters(story_id);
CREATE INDEX IF NOT EXISTS idx_illustrations_chapter_id ON public.illustrations(chapter_id);
CREATE INDEX IF NOT EXISTS idx_pdfs_story_id ON public.pdfs(story_id);
CREATE INDEX IF NOT EXISTS idx_story_tags_story_id ON public.story_tags(story_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_story_id ON public.generation_logs(story_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_replicate_id ON public.generation_logs(replicate_prediction_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_user_id ON public.ai_model_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_model ON public.ai_model_usage(model_name, model_version);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_model_usage_updated_at BEFORE UPDATE ON public.ai_model_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.illustrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_model_usage ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Stories policies
CREATE POLICY "Users can view own stories" ON public.stories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stories" ON public.stories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories" ON public.stories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories" ON public.stories
    FOR DELETE USING (auth.uid() = user_id);

-- Public stories can be viewed by anyone
CREATE POLICY "Anyone can view public stories" ON public.stories
    FOR SELECT USING (is_public = true);

-- Chapters policies
CREATE POLICY "Users can view chapters of own stories" ON public.chapters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert chapters to own stories" ON public.chapters
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update chapters of own stories" ON public.chapters
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete chapters of own stories" ON public.chapters
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

-- Public story chapters can be viewed by anyone
CREATE POLICY "Anyone can view chapters of public stories" ON public.chapters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND is_public = true
        )
    );

-- Illustrations policies
CREATE POLICY "Users can view illustrations of own stories" ON public.illustrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chapters c
            JOIN public.stories s ON c.story_id = s.id
            WHERE c.id = chapter_id AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert illustrations to own stories" ON public.illustrations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chapters c
            JOIN public.stories s ON c.story_id = s.id
            WHERE c.id = chapter_id AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update illustrations of own stories" ON public.illustrations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.chapters c
            JOIN public.stories s ON c.story_id = s.id
            WHERE c.id = chapter_id AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete illustrations of own stories" ON public.illustrations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.chapters c
            JOIN public.stories s ON c.story_id = s.id
            WHERE c.id = chapter_id AND s.user_id = auth.uid()
        )
    );

-- PDFs policies
CREATE POLICY "Users can view PDFs of own stories" ON public.pdfs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert PDFs to own stories" ON public.pdfs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete PDFs of own stories" ON public.pdfs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

-- Story tags policies
CREATE POLICY "Users can view tags of own stories" ON public.story_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert tags to own stories" ON public.story_tags
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tags of own stories" ON public.story_tags
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE id = story_id AND user_id = auth.uid()
        )
    );

-- User favorites policies
CREATE POLICY "Users can view own favorites" ON public.user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.user_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Generation logs policies
CREATE POLICY "Users can view own generation logs" ON public.generation_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation logs" ON public.generation_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generation logs" ON public.generation_logs
    FOR UPDATE USING (auth.uid() = user_id);

-- AI model usage policies
CREATE POLICY "Users can view own AI model usage" ON public.ai_model_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI model usage" ON public.ai_model_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI model usage" ON public.ai_model_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
