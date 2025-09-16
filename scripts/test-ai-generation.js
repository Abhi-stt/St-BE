require('dotenv').config();

async function testAIGeneration() {
  console.log('🤖 Testing AI Generation with Different Themes and Styles...\n');

  const testCases = [
    {
      name: "Fantasy Adventure",
      theme: "Adventure",
      art_style: "Fantasy",
      character_name: "Luna",
      character_age: 8,
      character_gender: "Female",
      target_age: "5-10"
    },
    {
      name: "Space Exploration",
      theme: "Space",
      art_style: "Realistic",
      character_name: "Alex",
      character_age: 12,
      character_gender: "Non-binary",
      target_age: "8-12"
    },
    {
      name: "Magical Forest",
      theme: "Nature",
      art_style: "Watercolor",
      character_name: "Finn",
      character_age: 6,
      character_gender: "Male",
      target_age: "4-8"
    },
    {
      name: "Underwater Adventure",
      theme: "Ocean",
      art_style: "Cartoon",
      character_name: "Coral",
      character_age: 10,
      character_gender: "Female",
      target_age: "6-10"
    }
  ];

  try {
    for (const testCase of testCases) {
      console.log(`\n📚 Testing: ${testCase.name}`);
      console.log(`Theme: ${testCase.theme}, Style: ${testCase.art_style}`);
      console.log(`Character: ${testCase.character_name} (${testCase.character_age}, ${testCase.character_gender})`);
      
      // Test story generation
      console.log('📖 Generating story...');
      const storyResponse = await fetch('http://localhost:8000/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase)
      });

      if (storyResponse.ok) {
        const storyData = await storyResponse.json();
        console.log('✅ Story generated successfully!');
        console.log(`Title: ${storyData.story.title}`);
        console.log(`Word count: ${storyData.story.word_count}`);
        console.log(`Reading time: ${storyData.story.reading_time_minutes} minutes`);
        
        // Test illustration generation
        console.log('🎨 Generating illustration...');
        const illustrationResponse = await fetch('http://localhost:8000/api/ai/generate-illustration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            story_id: storyData.story.id,
            chapter_id: 'chapter-1',
            prompt: `A ${testCase.art_style.toLowerCase()} illustration of ${testCase.character_name}, a ${testCase.character_age}-year-old ${testCase.character_gender.toLowerCase()} character in a ${testCase.theme.toLowerCase()} setting`,
            art_style: testCase.art_style
          })
        });

        if (illustrationResponse.ok) {
          const illustrationData = await illustrationResponse.json();
          console.log('✅ Illustration generated successfully!');
          console.log(`Image URL: ${illustrationData.illustration.image_url}`);
          console.log(`Style: ${illustrationData.illustration.style}`);
          console.log(`Dimensions: ${illustrationData.illustration.dimensions?.width}x${illustrationData.illustration.dimensions?.height}`);
        } else {
          const error = await illustrationResponse.json();
          console.log('❌ Illustration generation failed:', error.message);
        }
        
      } else {
        const error = await storyResponse.json();
        console.log('❌ Story generation failed:', error.message);
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    console.log('\n🎉 AI Generation test completed!');
    console.log('💡 Each test case should generate different stories and illustrations based on the input parameters.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Use dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  testAIGeneration();
});
