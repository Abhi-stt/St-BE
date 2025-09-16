require('dotenv').config();

console.log('🔧 Replicate API Setup Guide\n');

console.log('📋 REQUIRED CREDENTIALS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. REPLICATE_API_TOKEN');
console.log('2. REPLICATE_MODEL_VERSION');
console.log('3. REPLICATE_API_URL');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🎯 HOW TO GET EACH CREDENTIAL:\n');

console.log('1️⃣ REPLICATE_API_TOKEN:');
console.log('   📍 Go to: https://replicate.com/account/api-tokens');
console.log('   📝 Sign up/Login to Replicate');
console.log('   🔑 Click "Create API Token"');
console.log('   📋 Copy the token (starts with "r8_")');
console.log('   💾 Add to .env file: REPLICATE_API_TOKEN=r8_your_token_here\n');

console.log('2️⃣ REPLICATE_MODEL_VERSION:');
console.log('   📍 Go to: https://replicate.com/stability-ai/stable-diffusion');
console.log('   🔍 Look for "dreamshaper-xl-turbo" model');
console.log('   📋 Copy the version ID (e.g., "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf")');
console.log('   💾 Add to .env file: REPLICATE_MODEL_VERSION=your_version_here\n');

console.log('3️⃣ REPLICATE_API_URL:');
console.log('   🌐 Default URL: https://api.replicate.com/v1');
console.log('   💾 Add to .env file: REPLICATE_API_URL=https://api.replicate.com/v1\n');

console.log('📝 COMPLETE .env FILE EXAMPLE:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('# Replicate Configuration');
console.log('REPLICATE_API_TOKEN=r8_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz');
console.log('REPLICATE_MODEL_VERSION=db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf');
console.log('REPLICATE_API_URL=https://api.replicate.com/v1');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🧪 TEST YOUR CONFIGURATION:');
console.log('   Run: node scripts/test-replicate-connection.js\n');

console.log('💰 COST INFORMATION:');
console.log('   💵 Replicate charges per image generation');
console.log('   💰 DreamShaper XL Turbo: ~$0.002 per image');
console.log('   📊 Check pricing at: https://replicate.com/pricing\n');

console.log('🆓 ALTERNATIVE (FREE):');
console.log('   🎨 Current system works with demo images');
console.log('   🔄 No API keys needed for basic functionality');
console.log('   ✨ Images are generated based on character details and art styles\n');

console.log('🚀 NEXT STEPS:');
console.log('   1. Get Replicate API token');
console.log('   2. Update your .env file');
console.log('   3. Test the connection');
console.log('   4. Enjoy real AI-generated images!');
