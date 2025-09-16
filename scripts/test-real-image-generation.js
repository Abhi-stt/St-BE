require('dotenv').config();

async function testRealImageGeneration() {
  console.log('🎨 Testing Real Image Generation with Replicate\n');

  try {
    // Test different character and art style combinations
    const testCases = [
      {
        name: "Fantasy Princess",
        character_name: "Princess Luna",
        character_age: 8,
        character_gender: "Female",
        art_style: "Fantasy",
        theme: "Adventure"
      },
      {
        name: "Space Explorer",
        character_name: "Captain Alex",
        character_age: 12,
        character_gender: "Non-binary",
        art_style: "Realistic",
        theme: "Space"
      },
      {
        name: "Cartoon Hero",
        character_name: "Super Sam",
        character_age: 6,
        character_gender: "Male",
        art_style: "Cartoon",
        theme: "Adventure"
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🎭 Testing: ${testCase.name}`);
      console.log(`Character: ${testCase.character_name} (${testCase.character_age}, ${testCase.character_gender})`);
      console.log(`Style: ${testCase.art_style}, Theme: ${testCase.theme}`);
      
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
        
        // Test real image generation
        console.log('🎨 Generating real AI image...');
        const imagePrompt = `A ${testCase.art_style.toLowerCase()} illustration of ${testCase.character_name}, a ${testCase.character_age}-year-old ${testCase.character_gender.toLowerCase()} character in a ${testCase.theme.toLowerCase()} setting, children's book illustration style, high quality, detailed`;
        
        const imageResponse = await fetch('http://localhost:8000/api/ai/generate-illustration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            story_id: storyData.story.id,
            chapter_id: 'chapter-1',
            prompt: imagePrompt,
            art_style: testCase.art_style
          })
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          console.log('✅ Real AI image generated successfully!');
          console.log(`🖼️  Image URL: ${imageData.illustration.image_url}`);
          console.log(`🎨 Style: ${imageData.illustration.style}`);
          console.log(`📐 Dimensions: ${imageData.illustration.dimensions?.width}x${imageData.illustration.dimensions?.height}`);
        } else {
          const error = await imageResponse.json();
          console.log('❌ Image generation failed:', error.message);
          if (error.message.includes('402') || error.message.includes('credit')) {
            console.log('💳 You need to add credits to your Replicate account!');
            console.log('   Go to: https://replicate.com/account/billing#billing');
          }
        }
        
      } else {
        const error = await storyResponse.json();
        console.log('❌ Story generation failed:', error.message);
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    console.log('\n🎉 Real image generation test completed!');
    console.log('💡 If you see real image URLs (not placeholder.com), then Replicate is working!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Use dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  testRealImageGeneration();
});
