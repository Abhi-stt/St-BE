const express = require('express');
const router = express.Router();
const { supabaseAdmin, TABLES, getUserFromToken, createUserProfileIfNotExists } = require('../config/supabase');

// Get all stories for authenticated user
router.get('/', async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Ensure user profile exists
    await createUserProfileIfNotExists(user);

    // Fetch stories from database
    const { data: stories, error } = await supabaseAdmin
      .from(TABLES.STORIES)
      .select(`
        *,
        chapters (
          id,
          chapter_number,
          title,
          content,
          illustration_url,
          word_count
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      stories: stories || [],
      total: stories?.length || 0
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ 
      message: 'Failed to fetch stories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Create new story
router.post('/', async (req, res) => {
  try {
    const { title, description, theme, art_style, character_name, character_age, character_gender } = req.body;
    
    if (!title || !theme || !art_style) {
      return res.status(400).json({ message: 'Title, theme, and art_style are required' });
    }

    // Get user from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Ensure user profile exists
    await createUserProfileIfNotExists(user);

    // Create story in database
    const { data: newStory, error } = await supabaseAdmin
      .from(TABLES.STORIES)
      .insert({
        user_id: user.id,
        title,
        description: description || '',
        theme,
        art_style,
        character_name: character_name || '',
        character_age: character_age || null,
        character_gender: character_gender || '',
        status: 'draft',
        word_count: 0,
        reading_time_minutes: 0
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Created story:', newStory);

    res.status(201).json({
      message: 'Story created successfully',
      story: newStory
    });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ 
      message: 'Failed to create story',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get story by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Return demo story
    const demoStory = {
      id: id,
      title: 'The Magic Forest Adventure',
      description: 'A young explorer discovers a magical forest filled with talking animals and enchanted trees.',
      theme: 'Adventure',
      art_style: 'Fantasy',
      character_name: 'Alex',
      character_age: 10,
      character_gender: 'Non-binary',
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      word_count: 1200,
      reading_time_minutes: 5
    };

    res.json({
      story: demoStory
    });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ message: 'Failed to fetch story' });
  }
});

// Update story
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log('Updating story:', id, 'with:', updates);

    res.json({
      message: 'Story updated successfully',
      story: { id, ...updates, updated_at: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ message: 'Failed to update story' });
  }
});

// Delete story
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting story:', id);

    res.json({
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ message: 'Failed to delete story' });
  }
});

module.exports = router;
