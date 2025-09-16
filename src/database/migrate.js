const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Create storage buckets
    const buckets = ['illustrations', 'pdfs', 'avatars', 'story-assets'];
    
    for (const bucketName of buckets) {
      try {
        const { data, error } = await supabase.storage.createBucket(bucketName, {
          public: false,
          allowedMimeTypes: bucketName === 'pdfs' 
            ? ['application/pdf'] 
            : ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: bucketName === 'pdfs' ? 52428800 : 10485760 // 50MB for PDFs, 10MB for images
        });
        
        if (error) {
          if (error.message.includes('already exists')) {
            console.log(`✅ Bucket '${bucketName}' already exists`);
          } else {
            console.error(`❌ Error creating bucket '${bucketName}':`, error);
          }
        } else {
          console.log(`✅ Created bucket '${bucketName}'`);
        }
      } catch (err) {
        console.error(`❌ Error with bucket '${bucketName}':`, err);
      }
    }
    
    console.log('\n📋 Manual Steps Required:');
    console.log('1. Run the updated SQL schema in your Supabase SQL editor');
    console.log('2. The schema now includes Replicate integration fields:');
    console.log('   - generation_logs: replicate_prediction_id, output_url, model_name, model_version');
    console.log('   - ai_model_usage: new table for tracking Replicate model usage');
    console.log('   - Additional indexes and RLS policies for new fields');
    console.log('3. Set up your environment variables in .env file');
    console.log('4. Test the API endpoints');
    
    console.log('\n🔑 Required Environment Variables:');
    console.log('- SUPABASE_URL');
    console.log('- SUPABASE_SERVICE_ROLE_KEY');
    console.log('- REPLICATE_API_TOKEN (for DreamShaper XL Turbo)');
    console.log('- OPENAI_API_KEY (for text generation)');
    console.log('- JWT_SECRET');
    
    console.log('\n🎨 Replicate Model Configuration:');
    console.log('- Model: dreamshaper-xl-turbo');
    console.log('- Default version: latest');
    console.log('- Free tier: 500 images/month');
    console.log('- Cost after free tier: $0.002-0.01 per image');
    
    console.log('\n✅ Migration completed!');
    console.log('\n📝 Next Steps:');
    console.log('1. Apply the SQL schema updates in Supabase dashboard');
    console.log('2. Test the illustration generation endpoint');
    console.log('3. Monitor generation logs and model usage');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrate();
