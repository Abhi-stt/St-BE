require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up StoryTeller Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  const envTemplate = `# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Replicate Configuration (for image generation)
REPLICATE_API_TOKEN=your_replicate_api_token

# Server Configuration
PORT=8080
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created. Please update it with your actual API keys.');
} else {
  console.log('✅ .env file already exists');
}

// Check required environment variables
console.log('\n🔍 Checking environment variables...');

const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'REPLICATE_API_TOKEN'
];

const missingVars = [];

requiredVars.forEach(varName => {
  if (!process.env[varName] || process.env[varName].includes('your_')) {
    missingVars.push(varName);
    console.log(`❌ ${varName} is not set or using placeholder value`);
  } else {
    console.log(`✅ ${varName} is configured`);
  }
});

if (missingVars.length > 0) {
  console.log('\n⚠️  Please update the following environment variables in your .env file:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📖 Setup instructions:');
  console.log('1. Get your Supabase credentials from: https://supabase.com/dashboard');
  console.log('2. Get your OpenAI API key from: https://platform.openai.com/api-keys');
  console.log('3. Get your Replicate API token from: https://replicate.com/account/api-tokens');
  console.log('4. Update the .env file with your actual values');
  console.log('5. Run: npm run test-db');
} else {
  console.log('\n✅ All required environment variables are configured!');
  console.log('🎉 Setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run test-db (to test database connection)');
  console.log('2. Run: npm run dev (to start the development server)');
}

console.log('\n📚 Available commands:');
console.log('- npm run dev: Start development server');
console.log('- npm run start: Start production server');
console.log('- npm run test-db: Test database connection');
console.log('- npm run test: Run tests (not implemented yet)');
