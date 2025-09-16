const aiService = require('../src/services/aiService');

async function testPollinationsAI() {
  console.log('🧪 Testing Pollinations.AI Integration...\n');

  const testParams = {
    theme: 'Friendship',
    art_style: 'Classic Storybook',
    character_name: 'Luna',
    character_age: 5,
    character_gender: 'female',
    target_age: 'children'
  };

  try {
    console.log('📝 Testing text generation...');
    const story = await aiService.generateStory(testParams);
    console.log('✅ Text generation successful!');
    console.log(`   Title: ${story.title}`);
    console.log(`   Word count: ${story.word_count}`);
    console.log(`   Content preview: "${story.content.substring(0, 100)}..."\n`);

    console.log('🎨 Testing image generation...');
    const illustration = await aiService.generateIllustration(
      'A cute cartoon cat playing with a ball, children\'s book illustration',
      'Classic Storybook'
    );
    console.log('✅ Image generation successful!');
    console.log(`   Provider: ${illustration.provider}`);
    console.log(`   Dimensions: ${illustration.dimensions.width}x${illustration.dimensions.height}`);
    console.log(`   Image URL length: ${illustration.image_url.length} characters\n`);

    console.log('📚 Testing complete story generation...');
    const completeStory = await aiService.generateCompleteStory(testParams);
    console.log('✅ Complete story generation successful!');
    console.log(`   Total chapters: ${completeStory.chapters.length}`);
    console.log(`   Chapters with illustrations: ${completeStory.chapters.filter(c => c.illustration_url).length}`);

    console.log('\n🎉 All Pollinations.AI tests passed!');
    console.log('✨ Benefits of Pollinations.AI:');
    console.log('   ✅ No API key required');
    console.log('   ✅ Completely free');
    console.log('   ✅ Works for both text and images');
    console.log('   ✅ No rate limits');
    console.log('   ✅ Simple integration');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 This might be due to:');
    console.log('   - Internet connection issues');
    console.log('   - Pollinations.AI service temporarily down');
    console.log('   - Network firewall blocking requests');
  }
}

testPollinationsAI().catch(console.error);

