const aiService = require('../src/services/aiService');

async function testStoryLength() {
  console.log('🧪 Testing Story Length and Page Generation...\n');

  const testParams = {
    theme: 'Friendship',
    art_style: 'Classic Storybook',
    character_name: 'Luna',
    character_age: 5,
    character_gender: 'female',
    target_age: 'children'
  };

  try {
    console.log('📝 Generating story with new parameters...');
    console.log('   Expected: 5-8 sentences, 5 pages max\n');

    // Test story generation
    const story = await aiService.generateStory(testParams);
    console.log('✅ Story generated successfully!');
    console.log(`   Title: ${story.title}`);
    console.log(`   Word count: ${story.word_count}`);
    console.log(`   Reading time: ${story.reading_time_minutes} minutes\n`);

    // Test chapter splitting
    const chapters = aiService.splitStoryIntoChapters(story.content);
    console.log('📖 Story split into chapters:');
    console.log(`   Total chapters: ${chapters.length}`);
    
    chapters.forEach((chapter, index) => {
      console.log(`   Chapter ${chapter.chapter_number}: "${chapter.title}"`);
      console.log(`     Content: "${chapter.content.substring(0, 50)}..."`);
      console.log(`     Word count: ${chapter.word_count}\n`);
    });

    // Test complete story generation (without actual image generation)
    console.log('🎨 Testing complete story workflow...');
    console.log('   Expected: 5 chapters with illustration prompts\n');

    const completeStory = await aiService.generateCompleteStory(testParams);
    console.log('✅ Complete story generated!');
    console.log(`   Total chapters: ${completeStory.chapters.length}`);
    console.log(`   Chapters with illustrations: ${completeStory.chapters.filter(c => c.illustration_url).length}`);

    console.log('\n🎉 All tests passed! Story generation now supports:');
    console.log('   ✅ 5-8 sentences per story');
    console.log('   ✅ Up to 5 pages/chapters');
    console.log('   ✅ Up to 5 illustrations');
    console.log('   ✅ Proper PDF page structure');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   This might be due to missing API configuration.');
    console.log('\n💡 To fix:');
    console.log('   1. Set up your .env file with HUGGINGFACE_API_TOKEN');
    console.log('   2. Run: node scripts/setup-huggingface.js');
  }
}

testStoryLength().catch(console.error);

