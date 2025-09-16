const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupHuggingFace() {
  console.log('🚀 Setting up Hugging Face API Configuration\n');

  console.log('📋 You need a Hugging Face API token to use this service.');
  console.log('   Get your token from: https://huggingface.co/settings/tokens\n');

  const apiToken = await question('Enter your Hugging Face API token: ');
  
  if (!apiToken.trim()) {
    console.log('❌ No API token provided. Exiting...');
    rl.close();
    return;
  }

  console.log('\n📝 Available models:');
  console.log('   Text Generation:');
  console.log('   1. gpt2 (default, reliable)');
  console.log('   2. microsoft/DialoGPT-medium');
  console.log('   3. distilgpt2');
  console.log('   \n   Image Generation:');
  console.log('   1. runwayml/stable-diffusion-v1-5 (default, reliable)');
  console.log('   2. stabilityai/stable-diffusion-2-1');
  console.log('   3. CompVis/stable-diffusion-v1-4');

  const storyModel = await question('\nEnter story model (or press Enter for gpt2): ') || 'gpt2';
  const imageModel = await question('Enter image model (or press Enter for runwayml/stable-diffusion-v1-5): ') || 'runwayml/stable-diffusion-v1-5';

  // Create .env file content
  const envContent = `# Hugging Face Configuration
HUGGINGFACE_API_TOKEN=${apiToken}
HUGGINGFACE_STORY_MODEL=${storyModel}
HUGGINGFACE_IMAGE_MODEL=${imageModel}
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models

# Add your other environment variables below...
`;

  const envPath = path.join(__dirname, '..', '.env');
  
  try {
    // Check if .env exists
    if (fs.existsSync(envPath)) {
      const existingContent = fs.readFileSync(envPath, 'utf8');
      
      // Update existing .env file
      let updatedContent = existingContent;
      
      // Remove old Hugging Face config
      updatedContent = updatedContent.replace(/# Hugging Face Configuration[\s\S]*?HUGGINGFACE_API_URL=.*?\n\n/g, '');
      
      // Add new config at the top
      updatedContent = envContent + '\n' + updatedContent;
      
      fs.writeFileSync(envPath, updatedContent);
      console.log('✅ Updated existing .env file');
    } else {
      // Create new .env file
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Created new .env file');
    }

    console.log('\n🎉 Hugging Face configuration saved!');
    console.log('   You can now test the connection with: node scripts/test-huggingface-connection.js');
    
  } catch (error) {
    console.error('❌ Error saving configuration:', error.message);
  }

  rl.close();
}

setupHuggingFace().catch(console.error);

