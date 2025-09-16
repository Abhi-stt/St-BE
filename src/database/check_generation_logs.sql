-- Check the current structure of generation_logs table
-- Run this in your Supabase SQL editor

SELECT 'Current generation_logs table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'generation_logs' 
ORDER BY ordinal_position;

-- Check if the Replicate columns exist
SELECT 'Checking for Replicate columns:' as info;
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generation_logs' AND column_name = 'replicate_prediction_id') 
         THEN '✅ replicate_prediction_id exists' 
         ELSE '❌ replicate_prediction_id missing' 
    END as status;

SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generation_logs' AND column_name = 'output_url') 
         THEN '✅ output_url exists' 
         ELSE '❌ output_url missing' 
    END as status;

SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generation_logs' AND column_name = 'model_name') 
         THEN '✅ model_name exists' 
         ELSE '❌ model_name missing' 
    END as status;

SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'generation_logs' AND column_name = 'model_version') 
         THEN '✅ model_version exists' 
         ELSE '❌ model_version missing' 
    END as status;
