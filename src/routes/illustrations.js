const express = require('express');
const router = express.Router();

// Get illustrations for a story
router.get('/story/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    console.log('Fetching illustrations for story:', storyId);

    // Return demo illustrations
    const demoIllustrations = [
      {
        id: 'demo-illustration-1',
        chapter_id: 'demo-chapter-1',
        image_url: 'https://via.placeholder.com/512x512/4F46E5/FFFFFF?text=Demo+Illustration+1',
        thumbnail_url: 'https://via.placeholder.com/256x256/4F46E5/FFFFFF?text=Demo+Thumb+1',
        prompt: 'A magical forest scene',
        style: 'Fantasy',
        created_at: new Date().toISOString()
      }
    ];

    res.json({
      illustrations: demoIllustrations
    });
  } catch (error) {
    console.error('Error fetching illustrations:', error);
    res.status(500).json({ message: 'Failed to fetch illustrations' });
  }
});

module.exports = router;
