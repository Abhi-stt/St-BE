#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 StoryTeller API Setup Helper\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created!\n');
}

console.log('🚀 To get your app working, you need to set up API keys:\n');

console.log('1️⃣  HUGGING FACE API (Recommended - FREE):');
console.log('   • Go to: https://huggingface.co/settings/tokens');
console.log('   • Create a new token');
console.log('   • Add to .env file: HUGGINGFACE_API_TOKEN=your_token_here\n');

console.log('2️⃣  OPENAI API (Backup - PAID):');
console.log('   • Go to: https://platform.openai.com/api-keys');
console.log('   • Create a new API key');
console.log('   • Add to .env file: OPENAI_API_KEY=your_key_here\n');

console.log('📋 Current .env file location:');
console.log(`   ${envPath}\n`);

console.log('💡 After adding your API keys, restart your server and try again!');
console.log('   npm start\n');

// Check current status
const envContent = fs.readFileSync(envPath, 'utf8');
const hasHuggingFace = envContent.includes('HUGGINGFACE_API_TOKEN=your_huggingface_api_token') === false;
const hasOpenAI = envContent.includes('OPENAI_API_KEY=your_openai_api_key') === false;

console.log('📊 Current Status:');
console.log(`   Hugging Face: ${hasHuggingFace ? '✅ Configured' : '❌ Not configured'}`);
console.log(`   OpenAI: ${hasOpenAI ? '✅ Configured' : '❌ Not configured'}\n`);

if (!hasHuggingFace && !hasOpenAI) {
  console.log('⚠️  No API keys configured yet. Please follow the steps above.');
} else {
  console.log('🎉 You\'re all set! Your app should work now.');
}
