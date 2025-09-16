const express = require('express');
const router = express.Router();

// Get user dashboard
router.get('/dashboard', async (req, res) => {
  try {
    console.log('Fetching user dashboard');

    // Return demo dashboard data
    const dashboard = {
      user: {
        id: 'demo-user-123',
        email: 'demo@example.com',
        full_name: 'Demo User',
        subscription_tier: 'free',
        stories_created: 3,
        stories_limit: 5
      },
      stats: {
        total_stories: 3,
        completed_stories: 2,
        draft_stories: 1,
        total_words: 4500,
        total_illustrations: 4,
        total_pdfs: 2
      },
      recent_stories: [
        {
          id: 'demo-story-1',
          title: 'The Magic Forest Adventure',
          status: 'completed',
          created_at: new Date().toISOString()
        }
      ]
    };

    res.json({
      dashboard
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard' });
  }
});

// Get user favorites
router.get('/favorites', async (req, res) => {
  try {
    console.log('Fetching user favorites');

    // Return demo favorites
    const favorites = [
      {
        id: 'demo-favorite-1',
        story_id: 'demo-story-1',
        story: {
          title: 'The Magic Forest Adventure',
          theme: 'Adventure',
          art_style: 'Fantasy'
        },
        created_at: new Date().toISOString()
      }
    ];

    res.json({
      favorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

module.exports = router;
