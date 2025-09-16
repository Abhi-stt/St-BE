require('dotenv').config();
const aiService = require('./src/services/aiService');

async function testWorkflow() {
  try {
    console.log('🎯 Testing Complete Workflow...\n');
    
    console.log('Step 1: Generate Story...');
    const story = await aiService.generateStory({
      theme: 'Fantasy',
      art_style: 'Watercolor',
      character_name: 'Luna',
      character_age: 5,
      character_gender: 'female',
      target_age: 'children'
    });
    
    console.log('✅ Story Generated!');
    console.log('📖 Title:', story.title);
    console.log('📊 Words:', story.word_count);
    console.log('📝 Content:', story.content.substring(0, 100) + '...');
    
    console.log('\nStep 2: Generate Complete Storybook...');
    const storybook = await aiService.generateCompleteStory({
      theme: 'Fantasy',
      art_style: 'Watercolor',
      character_name: 'Luna',
      character_age: 5,
      character_gender: 'female',
      target_age: 'children'
    });
    
    console.log('✅ Storybook Generated!');
    console.log('📖 Title:', storybook.title);
    console.log('📄 Chapters:', storybook.chapters.length);
    console.log('🖼️ Images:', storybook.chapters.filter(c => c.illustration_url).length);
    
    console.log('\n🎉 Complete Workflow Success!');
    console.log('📚 Ready for PDF generation and download!');
    
  } catch (error) {
    console.error('❌ Error in workflow:', error.message);
    console.error('Stack:', error.stack);
  }
}

testWorkflow();
