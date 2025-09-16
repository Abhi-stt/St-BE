require('dotenv').config();

console.log('🔧 Getting Correct Replicate Model Information\n');

console.log('❌ ISSUE IDENTIFIED:');
console.log('The model version format is incorrect. Replicate needs the full model name, not just the version.\n');

console.log('✅ CORRECT MODEL FORMATS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. DreamShaper XL Turbo:');
console.log('   stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf');
console.log('');
console.log('2. Stable Diffusion XL:');
console.log('   stability-ai/stable-diffusion:stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b');
console.log('');
console.log('3. SDXL Base:');
console.log('   stability-ai/stable-diffusion:stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📝 UPDATE YOUR .env FILE:');
console.log('Replace this line:');
console.log('   REPLICATE_MODEL_VERSION=dreamshaper-xl-turbo');
console.log('');
console.log('With this:');
console.log('   REPLICATE_MODEL_VERSION=stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf');
console.log('');

console.log('🔍 HOW TO FIND THE CORRECT MODEL:');
console.log('1. Go to: https://replicate.com/stability-ai/stable-diffusion');
console.log('2. Look for "dreamshaper-xl-turbo" in the model list');
console.log('3. Click on it to see the full model name');
console.log('4. Copy the complete model identifier');
console.log('');

console.log('🧪 TEST AFTER UPDATE:');
console.log('Run: npm run test-replicate');
console.log('');

console.log('💡 ALTERNATIVE MODELS TO TRY:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('• stability-ai/stable-diffusion:stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b');
console.log('• stability-ai/stable-diffusion:stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b');
console.log('• runwayml/stable-diffusion:inpainting-1.0');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🎯 QUICK FIX:');
console.log('Update your .env file with the full model name and try again!');
