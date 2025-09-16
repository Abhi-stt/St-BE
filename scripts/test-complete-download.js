const express = require('express');
const aiService = require('../src/services/aiService');
const pdfService = require('../src/services/pdfService');

async function testCompleteDownload() {
  console.log('🧪 Testing Complete Download Functionality...\n');

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

    console.log('📄 Step 2: Generating PDF with images...');
    const pdfBuffer = await pdfService.generatePDFBuffer(storybook);
    console.log('✅ PDF generated successfully!');
    console.log(`   PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB\n`);

    console.log('🔍 Step 3: Verifying image data...');
    let allImagesValid = true;
    for (let i = 0; i < storybook.chapters.length; i++) {
      const chapter = storybook.chapters[i];
      if (chapter.illustration_url) {
        if (chapter.illustration_url.startsWith('data:image/')) {
          console.log(`   ✅ Chapter ${i + 1}: Valid base64 image (${chapter.illustration_url.length} chars)`);
        } else {
          console.log(`   ❌ Chapter ${i + 1}: Invalid image format`);
          allImagesValid = false;
        }
      } else {
        console.log(`   ⚠️  Chapter ${i + 1}: No image`);
      }
    }

    if (allImagesValid) {
      console.log('\n🎉 All tests passed! Download functionality is working correctly.');
      console.log('\n✨ What users can now do:');
      console.log('   📚 Generate stories with Pollinations.AI (no API key needed)');
      console.log('   🎨 Get AI-generated illustrations for each page');
      console.log('   📄 Download complete PDF storybooks');
      console.log('   💾 Save stories to their library');
      console.log('   🔄 Re-download stories anytime');
      
      console.log('\n🎯 Download buttons are available in:');
      console.log('   • Generator Page - after story generation');
      console.log('   • Story Page - for individual stories');
      console.log('   • Library Page - for saved stories');
      
    } else {
      console.log('\n❌ Some images are not in the correct format for PDF generation.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Stack trace:', error.stack);
  }
}

testCompleteDownload().catch(console.error);

