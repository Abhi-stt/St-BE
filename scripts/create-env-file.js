const fs = require('fs');
const path = require('path');

function createEnvFile() {
  console.log('🚀 Creating .env file for Hugging Face API...\n');

  const envContent = `# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Hugging Face Configuration (REQUIRED - for both text and image generation)
HUGGINGFACE_API_TOKEN=your_huggingface_api_token_here
HUGGINGFACE_STORY_MODEL=gpt2
HUGGINGFACE_IMAGE_MODEL=runwayml/stable-diffusion-v1-5
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models

# OpenAI Configuration (DISABLED - system uses Hugging Face only)
# OPENAI_API_KEY=your_openai_api_key
USE_DEMO_STORIES=false

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
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
`;

  const envPath = path.join(__dirname, '..', '.env');
  
  try {
    if (fs.existsSync(envPath)) {
      console.log('⚠️  .env file already exists!');
      console.log('   Backing up existing file to .env.backup');
      fs.copyFileSync(envPath, envPath + '.backup');
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Get your Hugging Face API token from: https://huggingface.co/settings/tokens');
    console.log('2. Edit the .env file and replace "your_huggingface_api_token_here" with your actual token');
    console.log('3. Set up your Supabase credentials (if not already done)');
    console.log('4. Test the connection: node scripts/test-huggingface-connection.js');
    console.log('\n🎯 The system is now configured to use Hugging Face ONLY for both text and image generation!');
    
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
}

createEnvFile();

