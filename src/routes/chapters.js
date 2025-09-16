const express = require('express');
const router = express.Router();

// Get chapters for a story
router.get('/story/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    console.log('Fetching chapters for story:', storyId);

    // Return demo chapters
    const demoChapters = [
      {
        id: 'demo-chapter-1',
        story_id: storyId,
        chapter_number: 1,
        title: 'The Beginning',
        content: 'Once upon a time, in a magical forest...',
        word_count: 150,
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-chapter-2',
        story_id: storyId,
        chapter_number: 2,
        title: 'The Adventure Begins',
        content: 'The young explorer stepped deeper into the forest...',
        word_count: 200,
        created_at: new Date().toISOString()
      }
    ];

    res.json({
      chapters: demoChapters
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ message: 'Failed to fetch chapters' });
  }
});

// Create new chapter
router.post('/', async (req, res) => {
  try {
    const { story_id, chapter_number, title, content } = req.body;
    
    if (!story_id || !chapter_number || !title || !content) {
      return res.status(400).json({ message: 'Story ID, chapter number, title, and content are required' });
    }

    console.log('Creating chapter:', { story_id, chapter_number, title });

    // Create demo chapter
    const newChapter = {
      id: 'demo-chapter-' + Date.now(),
      story_id,
      chapter_number,
      title,
      content,
      word_count: content.split(' ').length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Chapter created successfully',
      chapter: newChapter
    });
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({ message: 'Failed to create chapter' });
  }
});

module.exports = router;
