-- Safe Migration Script for Existing StoryTeller Database
-- Run this in your Supabase SQL editor to add missing columns safely

-- Step 1: Check current table structure
SELECT 'Current generation_logs columns:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'generation_logs' 
ORDER BY ordinal_position;

-- Step 2: Add missing columns to generation_logs table (if they don't exist)
DO $$
BEGIN
    -- Add replicate_prediction_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generation_logs' AND column_name = 'replicate_prediction_id') THEN
        ALTER TABLE public.generation_logs ADD COLUMN replicate_prediction_id TEXT;
        RAISE NOTICE 'Added replicate_prediction_id column to generation_logs';
    ELSE
        RAISE NOTICE 'replicate_prediction_id column already exists in generation_logs';
    END IF;
    
    -- Add output_url column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generation_logs' AND column_name = 'output_url') THEN
        ALTER TABLE public.generation_logs ADD COLUMN output_url TEXT;
        RAISE NOTICE 'Added output_url column to generation_logs';
    ELSE
        RAISE NOTICE 'output_url column already exists in generation_logs';
    END IF;
    
    -- Add model_name column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generation_logs' AND column_name = 'model_name') THEN
        ALTER TABLE public.generation_logs ADD COLUMN model_name TEXT DEFAULT 'dreamshaper-xl-turbo';
        RAISE NOTICE 'Added model_name column to generation_logs';
    ELSE
        RAISE NOTICE 'model_name column already exists in generation_logs';
    END IF;
    
    -- Add model_version column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generation_logs' AND column_name = 'model_version') THEN
        ALTER TABLE public.generation_logs ADD COLUMN model_version TEXT DEFAULT 'latest';
        RAISE NOTICE 'Added model_version column to generation_logs';
    ELSE
        RAISE NOTICE 'model_version column already exists in generation_logs';
    END IF;
END $$;

-- Step 3: Check if ai_model_usage table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_model_usage') THEN
        CREATE TABLE public.ai_model_usage (
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
        RAISE NOTICE 'Created ai_model_usage table';
    ELSE
        RAISE NOTICE 'ai_model_usage table already exists';
    END IF;
END $$;

-- Step 4: Create missing indexes
CREATE INDEX IF NOT EXISTS idx_generation_logs_replicate_id ON public.generation_logs(replicate_prediction_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_user_id ON public.ai_model_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_model ON public.ai_model_usage(model_name, model_version);

-- Step 5: Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Add triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ai_model_usage_updated_at') THEN
        CREATE TRIGGER update_ai_model_usage_updated_at BEFORE UPDATE ON public.ai_model_usage
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added trigger for ai_model_usage';
    ELSE
        RAISE NOTICE 'Trigger for ai_model_usage already exists';
    END IF;
END $$;

-- Step 7: Enable RLS on ai_model_usage if not already enabled
ALTER TABLE public.ai_model_usage ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies for ai_model_usage if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_model_usage' AND policyname = 'Users can view own AI model usage') THEN
        CREATE POLICY "Users can view own AI model usage" ON public.ai_model_usage
            FOR SELECT USING (auth.uid() = user_id);
        RAISE NOTICE 'Added SELECT policy for ai_model_usage';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_model_usage' AND policyname = 'Users can insert own AI model usage') THEN
        CREATE POLICY "Users can insert own AI model usage" ON public.ai_model_usage
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Added INSERT policy for ai_model_usage';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_model_usage' AND policyname = 'Users can update own AI model usage') THEN
        CREATE POLICY "Users can update own AI model usage" ON public.ai_model_usage
            FOR UPDATE USING (auth.uid() = user_id);
        RAISE NOTICE 'Added UPDATE policy for ai_model_usage';
    END IF;
END $$;

-- Step 9: Final verification
SELECT 'Final generation_logs structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'generation_logs' 
ORDER BY ordinal_position;

SELECT 'Final ai_model_usage structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'ai_model_usage' 
ORDER BY ordinal_position;

-- Step 10: Grant permissions
GRANT ALL ON public.ai_model_usage TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
