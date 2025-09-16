-- Fix missing Replicate columns in existing tables
-- Run this in your Supabase SQL editor to add the missing columns

-- First, let's check what columns exist in generation_logs
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'generation_logs' 
ORDER BY ordinal_position;

-- Add missing columns to generation_logs table
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

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'generation_logs' 
AND column_name IN ('replicate_prediction_id', 'output_url', 'model_name', 'model_version')
ORDER BY ordinal_position;

-- Create index for replicate_prediction_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_generation_logs_replicate_id ON public.generation_logs(replicate_prediction_id);

-- Check if ai_model_usage table exists and has the right columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_model_usage') THEN
        -- Add missing columns to ai_model_usage table
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_model_usage' AND column_name = 'images_generated') THEN
            ALTER TABLE public.ai_model_usage ADD COLUMN images_generated INTEGER DEFAULT 0;
            RAISE NOTICE 'Added images_generated column to ai_model_usage';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_model_usage' AND column_name = 'cost_usd') THEN
            ALTER TABLE public.ai_model_usage ADD COLUMN cost_usd DECIMAL(10,6) DEFAULT 0;
            RAISE NOTICE 'Added cost_usd column to ai_model_usage';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_model_usage' AND column_name = 'updated_at') THEN
            ALTER TABLE public.ai_model_usage ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Added updated_at column to ai_model_usage';
        END IF;
    ELSE
        RAISE NOTICE 'ai_model_usage table does not exist yet';
    END IF;
END $$;

-- Final verification
SELECT 'generation_logs columns:' as table_info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'generation_logs' 
ORDER BY ordinal_position;

SELECT 'ai_model_usage columns:' as table_info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'ai_model_usage' 
ORDER BY ordinal_position;
