const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testYourModels() {
  console.log('🧪 Testing Your Specific Hugging Face Models...\n');

  // Check environment variables
  const apiToken = process.env.HUGGINGFACE_API_TOKEN;
  const textModel = process.env.HUGGINGFACE_MODEL_TEXT || 'mistralai/Mistral-7B-Instruct-v0.3';
  const imageModel = process.env.HUGGINGFACE_MODEL_IMAGE || 'stabilityai/stable-diffusion-3.5-medium';
  const apiUrl = process.env.HUGGINGFACE_API_URL || 'https://api-inference.huggingface.co/models';

  console.log('📋 Your Configuration:');
  console.log(`   API Token: ${apiToken ? '✅ Set' : '❌ Not set'}`);
  console.log(`   Text Model: ${textModel}`);
  console.log(`   Image Model: ${imageModel}`);
  console.log(`   API URL: ${apiUrl}\n`);

  if (!apiToken) {
    console.error('❌ HUGGINGFACE_API_TOKEN is not set!');
    console.log('   Please set your Hugging Face API token in the .env file');
    console.log('   Get your token from: https://huggingface.co/settings/tokens');
    return;
  }

  // Test text generation with your model
  console.log('🤖 Testing text generation with Mistral...');
  try {
    const textResponse = await fetch(`${apiUrl}/${textModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: 'Once upon a time, there was a brave little girl named Luna who',
        parameters: {
          max_length: 100,
          temperature: 0.8,
          do_sample: true,
          return_full_text: false
        }
      })
    });

    if (textResponse.ok) {
      const textResult = await textResponse.json();
      console.log('✅ Text generation successful!');
      console.log(`   Model: ${textModel}`);
      console.log(`   Generated: ${JSON.stringify(textResult)}`);
    } else {
      const errorText = await textResponse.text();
      console.error(`❌ Text generation failed: ${textResponse.status} - ${errorText}`);
      
      if (textResponse.status === 404) {
        console.log('\n💡 The model might not be available through the Inference API.');
        console.log('   Try using a different model like:');
        console.log('   - microsoft/DialoGPT-medium');
        console.log('   - gpt2');
        console.log('   - distilgpt2');
      }
    }
  } catch (error) {
    console.error(`❌ Text generation error: ${error.message}`);
  }

  console.log('\n🎨 Testing image generation with Stable Diffusion...');
  try {
    const imageResponse = await fetch(`${apiUrl}/${imageModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: 'a cute cartoon cat playing with a ball, children\'s book illustration',
        parameters: {
          width: 256,
          height: 256,
          num_inference_steps: 10
        }
      })
    });

    if (imageResponse.ok) {
      console.log('✅ Image generation successful!');
      console.log(`   Model: ${imageModel}`);
      console.log(`   Response size: ${(await imageResponse.arrayBuffer()).byteLength} bytes`);
    } else {
      const errorText = await imageResponse.text();
      console.error(`❌ Image generation failed: ${imageResponse.status} - ${errorText}`);
      
      if (imageResponse.status === 404) {
        console.log('\n💡 The model might not be available through the Inference API.');
        console.log('   Try using a different model like:');
        console.log('   - runwayml/stable-diffusion-v1-5');
        console.log('   - CompVis/stable-diffusion-v1-4');
      }
    }
  } catch (error) {
    console.error(`❌ Image generation error: ${error.message}`);
  }

  console.log('\n✨ Test completed!');
  console.log('\n📝 If both tests failed with 404 errors, the models might not be available');
  console.log('   through the Hugging Face Inference API. Try using the models from env.example');
}

// Run the test
testYourModels().catch(console.error);

