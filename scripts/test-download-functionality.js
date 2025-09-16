const aiService = require('../src/services/aiService');
const pdfService = require('../src/services/pdfService');

async function testDownloadFunctionality() {
  console.log('🧪 Testing Download Functionality with Pollinations.AI...\n');

  const testParams = {
    theme: 'Friendship',
    art_style: 'Classic Storybook',
    character_name: 'Luna',
    character_age: 5,
    character_gender: 'female',
    target_age: 'children'
  };

  try {
    console.log('📝 Step 1: Generating complete story with Pollinations.AI...');
    const storybook = await aiService.generateCompleteStory(testParams);
    console.log('✅ Story generated successfully!');
    console.log(`   Title: ${storybook.title}`);
    console.log(`   Chapters: ${storybook.chapters.length}`);
    console.log(`   Images: ${storybook.chapters.filter(c => c.illustration_url).length}\n`);

    console.log('📄 Step 2: Generating PDF...');
    const pdfBuffer = await pdfService.generatePDFBuffer(storybook);
    console.log('✅ PDF generated successfully!');
    console.log(`   PDF size: ${pdfBuffer.length} bytes`);
    console.log(`   PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB\n`);

    console.log('💾 Step 3: Testing image handling...');
    for (let i = 0; i < storybook.chapters.length; i++) {
      const chapter = storybook.chapters[i];
      if (chapter.illustration_url) {
        console.log(`   Chapter ${i + 1}: Image URL length: ${chapter.illustration_url.length} characters`);
        if (chapter.illustration_url.startsWith('data:')) {
          console.log(`   ✅ Base64 image format detected`);
        } else {
          console.log(`   ⚠️  External URL format detected`);
        }
      } else {
        console.log(`   Chapter ${i + 1}: No image`);
      }
    }

    console.log('\n🎉 Download functionality test completed successfully!');
    console.log('✨ The system should now work for downloading PDFs with Pollinations.AI images.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Stack trace:', error.stack);
  }
}

testDownloadFunctionality().catch(console.error);

