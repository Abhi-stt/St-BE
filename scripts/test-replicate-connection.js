require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testReplicateConnection() {
  console.log('🧪 Testing Replicate API Connection...\n');

  // Check environment variables
  console.log('🔍 Checking Environment Variables:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const replicateToken = process.env.REPLICATE_API_TOKEN;
  const modelVersion = process.env.REPLICATE_MODEL_VERSION;
  const apiUrl = process.env.REPLICATE_API_URL;

  console.log(`REPLICATE_API_TOKEN: ${replicateToken ? '✅ Set' : '❌ Not set'}`);
  console.log(`REPLICATE_MODEL_VERSION: ${modelVersion ? '✅ Set' : '❌ Not set'}`);
  console.log(`REPLICATE_API_URL: ${apiUrl ? '✅ Set' : '❌ Not set'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!replicateToken) {
    console.log('❌ REPLICATE_API_TOKEN is not set!');
    console.log('📝 Please add it to your .env file:');
    console.log('   REPLICATE_API_TOKEN=r8_your_token_here\n');
    return;
  }

  if (!modelVersion) {
    console.log('❌ REPLICATE_MODEL_VERSION is not set!');
    console.log('📝 Please add it to your .env file:');
    console.log('   REPLICATE_MODEL_VERSION=dreamshaper-xl-turbo\n');
    return;
  }

  try {
    // Test Replicate connection
    console.log('🔗 Testing Replicate API Connection...');
    
    const Replicate = require('replicate');
    const replicate = new Replicate({
      auth: replicateToken,
      apiUrl: apiUrl || 'https://api.replicate.com/v1',
    });

    // Test with a simple prompt
    const testPrompt = 'A cute cartoon character, children\'s book illustration style';
    const modelId = modelVersion.includes('/') ? modelVersion : `stability-ai/stable-diffusion:${modelVersion}`;
    
    console.log(`📝 Testing with prompt: "${testPrompt}"`);
    console.log(`🤖 Using model: ${modelId}`);
    console.log('⏳ Generating test image... (this may take 30-60 seconds)\n');

    const output = await replicate.run(modelId, {
      input: {
        prompt: testPrompt,
        width: 512,
        height: 512,
        num_outputs: 1,
        num_inference_steps: 10, // Reduced for faster testing
        guidance_scale: 7.5,
        scheduler: "K_EULER"
      }
    });

    console.log('✅ Replicate API Connection Successful!');
    console.log('🖼️  Generated Image URL:', output[0]);
    console.log('🎉 Your Replicate configuration is working correctly!\n');

    console.log('💡 You can now use real AI-generated images in your StoryTeller app!');

  } catch (error) {
    console.log('❌ Replicate API Connection Failed!');
    console.log('Error:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n🔑 Authentication Error:');
      console.log('   - Check if your REPLICATE_API_TOKEN is correct');
      console.log('   - Make sure the token starts with "r8_"');
      console.log('   - Verify the token is not expired');
    } else if (error.message.includes('404')) {
      console.log('\n🔍 Model Not Found Error:');
      console.log('   - Check if your REPLICATE_MODEL_VERSION is correct');
      console.log('   - Try using: dreamshaper-xl-turbo');
    } else if (error.message.includes('fetch')) {
      console.log('\n🌐 Network Error:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the REPLICATE_API_URL is correct');
    }
    
    console.log('\n🆓 Don\'t worry! The app will use demo images as fallback.');
  }
}

testReplicateConnection();
