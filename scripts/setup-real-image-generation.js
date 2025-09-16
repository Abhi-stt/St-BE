require('dotenv').config();

console.log('🎨 Setting Up Real Image Generation with Replicate\n');

console.log('💰 STEP 1: Add Credits to Replicate Account');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. Go to: https://replicate.com/account/billing#billing');
console.log('2. Click "Add Credits" or "Purchase Credits"');
console.log('3. Add at least $5-10 to your account');
console.log('4. Wait 2-3 minutes for credits to be processed');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🔧 STEP 2: Verify Your Configuration');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Your current .env settings:');
console.log(`REPLICATE_API_TOKEN: ${process.env.REPLICATE_API_TOKEN ? '✅ Set' : '❌ Not set'}`);
console.log(`REPLICATE_MODEL_VERSION: ${process.env.REPLICATE_MODEL_VERSION ? '✅ Set' : '❌ Not set'}`);
console.log(`REPLICATE_API_URL: ${process.env.REPLICATE_API_URL ? '✅ Set' : '❌ Not set'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🧪 STEP 3: Test Real Image Generation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('After adding credits, run:');
console.log('   npm run test-replicate');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🎯 STEP 4: Test with Your App');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. Start your backend: npm run dev');
console.log('2. Test story generation with real images');
console.log('3. Use the frontend to create stories');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('💡 COST ESTIMATION:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('• DreamShaper XL Turbo: ~$0.002 per image');
console.log('• $5 credit = ~2,500 images');
console.log('• $10 credit = ~5,000 images');
console.log('• Perfect for development and testing!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🚀 WHAT HAPPENS AFTER SETUP:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Real AI-generated images based on your prompts');
console.log('✅ Different images for each character and art style');
console.log('✅ High-quality illustrations for your stories');
console.log('✅ Professional-looking children\'s book artwork');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📞 NEED HELP?');
console.log('• Replicate Support: https://replicate.com/help');
console.log('• Billing Issues: https://replicate.com/account/billing');
console.log('• Model Documentation: https://replicate.com/stability-ai/stable-diffusion');
