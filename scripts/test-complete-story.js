require('dotenv').config();

async function testCompleteStory() {
  console.log('📚 Testing Complete Story Generation...\n');

  const testCases = [
    {
      name: "Princess Adventure",
      theme: "Adventure",
      art_style: "Fantasy",
      character_name: "Princess Luna",
      character_age: 7,
      character_gender: "Female",
      target_age: "5-8"
    },
    {
      name: "Robot Explorer",
      theme: "Space",
      art_style: "Realistic",
      character_name: "Robo-Alex",
      character_age: 10,
      character_gender: "Non-binary",
      target_age: "8-12"
    },
    {
      name: "Magical Unicorn",
      theme: "Nature",
      art_style: "Watercolor",
      character_name: "Sparkle",
      character_age: 5,
      character_gender: "Female",
      target_age: "3-6"
    }
  ];

  try {
    for (const testCase of testCases) {
      console.log(`\n📖 Testing: ${testCase.name}`);
      console.log(`Character: ${testCase.character_name} (${testCase.character_age}, ${testCase.character_gender})`);
      console.log(`Theme: ${testCase.theme}, Style: ${testCase.art_style}`);
      
      // Test complete story generation
      const response = await fetch('http://localhost:8000/api/ai/generate-complete-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Complete story generated successfully!');
        console.log(`Title: ${data.story.title}`);
        console.log(`Word count: ${data.story.word_count}`);
        console.log(`Reading time: ${data.story.reading_time_minutes} minutes`);
        console.log(`Chapters: ${data.story.chapters?.length || 0}`);
        
        if (data.story.chapters && data.story.chapters.length > 0) {
          console.log('\n📑 Chapter Details:');
          data.story.chapters.forEach((chapter, index) => {
            console.log(`  Chapter ${index + 1}: ${chapter.title}`);
            console.log(`    Word count: ${chapter.word_count}`);
            console.log(`    Has illustration: ${chapter.illustration_url ? 'Yes' : 'No'}`);
            if (chapter.illustration_url) {
              console.log(`    Image: ${chapter.illustration_url}`);
            }
          });
        }
        
      } else {
        const error = await response.json();
        console.log('❌ Complete story generation failed:', error.message);
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    console.log('\n🎉 Complete story generation test completed!');
    console.log('💡 Each story should have different content, characters, and illustrations based on the input parameters.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Use dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  testCompleteStory();
});
