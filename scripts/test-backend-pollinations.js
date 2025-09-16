const fetch = require('node-fetch');

async function testBackendPollinations() {
  console.log('🧪 Testing Backend with Pollinations.AI...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:8000/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend is running:', healthData.status);
    } else {
      throw new Error('Health check failed');
    }

    // Test 2: Story generation
    console.log('\n2️⃣ Testing story generation...');
    const storyResponse = await fetch('http://localhost:8000/api/ai/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        theme: 'Friendship',
        art_style: 'Classic Storybook',
        character_name: 'Luna',
        character_age: 5,
        character_gender: 'female',
        target_age: 'children'
      }),
    });

    if (storyResponse.ok) {
      const storyData = await storyResponse.json();
      console.log('✅ Story generation successful!');
      console.log(`   Title: ${storyData.story.title}`);
      console.log(`   Content length: ${storyData.story.content.length} characters`);
    } else {
      const errorText = await storyResponse.text();
      console.error('❌ Story generation failed:', errorText);
      throw new Error(`Story generation failed: ${storyResponse.status}`);
    }

    // Test 3: Illustration generation
    console.log('\n3️⃣ Testing illustration generation...');
    const illustrationResponse = await fetch('http://localhost:8000/api/ai/generate-illustration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'A cute cartoon cat playing with a ball, children\'s book illustration',
        art_style: 'Classic Storybook'
      }),
    });

    if (illustrationResponse.ok) {
      const illustrationData = await illustrationResponse.json();
      console.log('✅ Illustration generation successful!');
      console.log(`   Image URL length: ${illustrationData.illustration.image_url.length} characters`);
      console.log(`   Provider: ${illustrationData.illustration.provider}`);
    } else {
      const errorText = await illustrationResponse.text();
      console.error('❌ Illustration generation failed:', errorText);
      throw new Error(`Illustration generation failed: ${illustrationResponse.status}`);
    }

    console.log('\n🎉 All tests passed! Backend is working correctly with Pollinations.AI.');
    console.log('\n💡 If the frontend is still not working, check:');
    console.log('   1. Browser console for errors');
    console.log('   2. Network tab for failed requests');
    console.log('   3. Make sure you\'re logged in');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure backend is running: npm start');
    console.log('   2. Check if port 8000 is available');
    console.log('   3. Verify Pollinations.AI is accessible');
  }
}

testBackendPollinations().catch(console.error);

