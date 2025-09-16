const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testHuggingFaceConnection() {
  console.log('🧪 Testing Hugging Face API Connection...\n');

  // Check environment variables
  const apiToken = process.env.HUGGINGFACE_API_TOKEN;
  const storyModel = process.env.HUGGINGFACE_STORY_MODEL || 'gpt2';
  const imageModel = process.env.HUGGINGFACE_IMAGE_MODEL || 'runwayml/stable-diffusion-v1-5';
  const apiUrl = process.env.HUGGINGFACE_API_URL || 'https://api-inference.huggingface.co/models';

  console.log('📋 Configuration:');
  console.log(`   API Token: ${apiToken ? '✅ Set' : '❌ Not set'}`);
  console.log(`   Story Model: ${storyModel}`);
  console.log(`   Image Model: ${imageModel}`);
  console.log(`   API URL: ${apiUrl}\n`);

  if (!apiToken) {
    console.error('❌ HUGGINGFACE_API_TOKEN is not set!');
    console.log('   Please set your Hugging Face API token in the .env file');
    console.log('   Get your token from: https://huggingface.co/settings/tokens');
    return;
  }

  // Test text generation
  console.log('🤖 Testing text generation...');
  try {
    const textResponse = await fetch(`${apiUrl}/${storyModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: 'Once upon a time, there was a brave little',
        parameters: {
          max_length: 50,
          temperature: 0.8,
          do_sample: true,
          return_full_text: false
        }
      })
    });

    if (textResponse.ok) {
      const textResult = await textResponse.json();
      console.log('✅ Text generation successful!');
      console.log(`   Generated: ${JSON.stringify(textResult)}`);
    } else {
      const errorText = await textResponse.text();
      console.error(`❌ Text generation failed: ${textResponse.status} - ${errorText}`);
    }
  } catch (error) {
    console.error(`❌ Text generation error: ${error.message}`);
  }

  console.log('\n🎨 Testing image generation...');
  try {
    const imageResponse = await fetch(`${apiUrl}/${imageModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: 'a cute cartoon cat playing with a ball',
        parameters: {
          width: 256,
          height: 256,
          num_inference_steps: 10
        }
      })
    });

    if (imageResponse.ok) {
      console.log('✅ Image generation successful!');
      console.log(`   Response size: ${(await imageResponse.arrayBuffer()).byteLength} bytes`);
    } else {
      const errorText = await imageResponse.text();
      console.error(`❌ Image generation failed: ${imageResponse.status} - ${errorText}`);
    }
  } catch (error) {
    console.error(`❌ Image generation error: ${error.message}`);
  }

  console.log('\n✨ Test completed!');
}

// Run the test
testHuggingFaceConnection().catch(console.error);

