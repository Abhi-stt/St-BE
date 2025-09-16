const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const pdfService = require('../services/pdfService');
const { supabaseAdmin, TABLES, getUserFromToken } = require('../config/supabase');

// Generate story with AI
router.post('/generate-story', async (req, res) => {
  try {
    const { theme, art_style, character_name, character_age, character_gender, target_age } = req.body;
    
    if (!theme || !art_style) {
      return res.status(400).json({ message: 'Theme and art_style are required' });
    }

    console.log('Generating story with:', { theme, art_style, character_name, character_age, character_gender, target_age });

    // Generate story using AI service
    const generatedStory = await aiService.generateStory({
      theme,
      art_style,
      character_name,
      character_age,
      character_gender,
      target_age
    });

    // Add metadata
    const storyData = {
      ...generatedStory,
      id: 'story-' + Date.now(),
      status: 'completed',
      created_at: new Date().toISOString()
    };

    res.json({
      message: 'Story generated successfully',
      story: storyData
    });

  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ 
      message: 'Failed to generate story',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Generate complete storybook with 5-6 images
router.post('/generate-storybook', async (req, res) => {
  try {
    const { theme, art_style, character_name, character_age, character_gender, target_age } = req.body;
    
    if (!theme || !art_style) {
      return res.status(400).json({ message: 'Theme and art_style are required' });
    }

    console.log('Generating storybook with:', { theme, art_style, character_name, character_age, character_gender, target_age });

    // Generate complete storybook using AI service
    const storybook = await aiService.generateCompleteStory({
      theme,
      art_style,
      character_name,
      character_age,
      character_gender,
      target_age
    });

    // Add metadata
    const storybookData = {
      ...storybook,
      id: 'storybook-' + Date.now(),
      status: 'completed',
      created_at: new Date().toISOString(),
      total_pages: storybook.chapters.length,
      total_images: storybook.chapters.filter(c => c.illustration_url).length
    };

    res.json({
      message: 'Storybook generated successfully',
      storybook: storybookData
    });

  } catch (error) {
    console.error('Error generating storybook:', error);
    res.status(500).json({ 
      message: 'Failed to generate storybook',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Generate and download PDF storybook
router.post('/generate-pdf', async (req, res) => {
  try {
    const { theme, art_style, character_name, character_age, character_gender, target_age } = req.body;
    
    if (!theme || !art_style) {
      return res.status(400).json({ message: 'Theme and art_style are required' });
    }

    console.log('Generating PDF storybook with:', { theme, art_style, character_name, character_age, character_gender, target_age });

    // Generate complete storybook
    const storybook = await aiService.generateCompleteStory({
      theme,
      art_style,
      character_name,
      character_age,
      character_gender,
      target_age
    });

    // Generate PDF
    const pdfBuffer = await pdfService.generatePDFBuffer(storybook);

    // Set response headers for PDF download
    const filename = `${storybook.title.replace(/[^a-zA-Z0-9]/g, '_')}_storybook.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      message: 'Failed to generate PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Generate illustration
router.post('/generate-illustration', async (req, res) => {
  try {
    const { story_id, chapter_id, prompt, art_style } = req.body;
    
    if (!prompt || !art_style) {
      return res.status(400).json({ message: 'Prompt and art_style are required' });
    }

    console.log('Generating illustration with:', { story_id, chapter_id, prompt, art_style });

    // Generate illustration using AI service
    const illustration = await aiService.generateIllustration(prompt, art_style);
    
    // Generate unique ID for the illustration
    const illustrationId = 'illustration-' + Date.now();
    
    res.json({
      message: 'Illustration generated successfully',
      illustration: {
        id: illustrationId,
        story_id,
        chapter_id,
        ...illustration,
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating illustration:', error);
    res.status(500).json({ 
      message: 'Failed to generate illustration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Generate complete story with illustrations
router.post('/generate-complete-story', async (req, res) => {
  try {
    const { theme, art_style, character_name, character_age, character_gender, target_age } = req.body;
    
    if (!theme || !art_style) {
      return res.status(400).json({ message: 'Theme and art_style are required' });
    }

    console.log('Generating complete story with illustrations:', { theme, art_style, character_name, character_age, character_gender, target_age });

    // Generate complete story with illustrations
    const completeStory = await aiService.generateCompleteStory({
      theme,
      art_style,
      character_name,
      character_age,
      character_gender,
      target_age
    });

    // Add metadata
    const storyData = {
      ...completeStory,
      id: 'complete-story-' + Date.now(),
      status: 'completed',
      created_at: new Date().toISOString()
    };

    res.json({
      message: 'Complete story with illustrations generated successfully',
      story: storyData
    });

  } catch (error) {
    console.error('Error generating complete story:', error);
    res.status(500).json({ 
      message: 'Failed to generate complete story',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Generate storybook with progress updates
router.post('/generate-storybook-with-progress', async (req, res) => {
  try {
    const { theme, art_style, character_name, character_age, character_gender, target_age } = req.body;
    
    if (!theme || !art_style) {
      return res.status(400).json({ message: 'Theme and art_style are required' });
    }

    console.log('Generating storybook with progress:', { theme, art_style, character_name, character_age, character_gender, target_age });

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    const sendProgress = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      // Step 1: Generate story text
      sendProgress({ 
        step: 'text_generation', 
        message: 'Generating story text...', 
        progress: 20 
      });

      const story = await aiService.generateStory({
        theme,
        art_style,
        character_name,
        character_age,
        character_gender,
        target_age
      });

      sendProgress({ 
        step: 'text_complete', 
        message: 'Story text generated!', 
        progress: 40,
        story: story
      });

      // Step 2: Split into chapters
      sendProgress({ 
        step: 'chapters', 
        message: 'Preparing story pages...', 
        progress: 50 
      });

      const chapters = aiService.splitStoryIntoChapters(story.content);

      sendProgress({ 
        step: 'chapters_complete', 
        message: 'Story pages prepared!', 
        progress: 60,
        chapters: chapters
      });

      // Step 3: Generate images
      sendProgress({ 
        step: 'image_generation', 
        message: 'Generating illustrations...', 
        progress: 70 
      });

      const chaptersWithIllustrations = [];
      const maxImages = 5;
      
      for (let i = 0; i < Math.min(chapters.length, maxImages); i++) {
        const chapter = chapters[i];
        const illustrationPrompt = aiService.generateIllustrationPrompt(chapter, story.theme, story.art_style);
        
        try {
          const illustration = await aiService.generateIllustration(illustrationPrompt, story.art_style);
          chaptersWithIllustrations.push({
            ...chapter,
            illustration_url: illustration.image_url,
            illustration_prompt: illustrationPrompt
          });
          
          sendProgress({ 
            step: 'image_progress', 
            message: `Generated illustration ${i + 1} of ${Math.min(chapters.length, maxImages)}...`, 
            progress: 70 + ((i + 1) * 10 / maxImages)
          });
        } catch (error) {
          console.error(`Error generating illustration for chapter ${i + 1}:`, error);
          chaptersWithIllustrations.push({
            ...chapter,
            illustration_url: null,
            illustration_prompt: illustrationPrompt
          });
        }
      }

      // Step 4: Complete storybook
      const completeStorybook = {
        ...story,
        chapters: chaptersWithIllustrations
      };

      sendProgress({ 
        step: 'complete', 
        message: 'Storybook ready for download!', 
        progress: 100,
        storybook: completeStorybook,
        downloadUrl: `/api/ai/download-storybook/${completeStorybook.id || 'storybook-' + Date.now()}`
      });

      // Close the connection
      res.end();

    } catch (error) {
      sendProgress({ 
        step: 'error', 
        message: 'Error generating storybook', 
        error: error.message 
      });
      res.end();
    }

  } catch (error) {
    console.error('Error in storybook generation:', error);
    res.status(500).json({ 
      message: 'Failed to generate storybook',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Download storybook PDF
router.get('/download-storybook/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // For now, we'll regenerate the storybook with the same parameters
    // In a real app, you'd store and retrieve the storybook from a database
    // For this demo, we'll use the request body or generate a default one
    
    // Get storybook parameters from query string or use defaults
    const { theme, art_style, character_name, character_age, character_gender, target_age } = req.query;
    
    if (!theme || !art_style) {
      return res.status(400).json({ message: 'Theme and art_style are required' });
    }

    // Generate the complete storybook with images
    const storybook = await aiService.generateCompleteStory({
      theme,
      art_style,
      character_name: character_name || 'Alex',
      character_age: character_age ? parseInt(character_age) : 10,
      character_gender: character_gender || 'non-binary',
      target_age: target_age || '5-10'
    });

    // Generate PDF
    const pdfBuffer = await pdfService.generatePDFBuffer(storybook);

    // Set response headers for PDF download
    const filename = `${storybook.title.replace(/[^a-zA-Z0-9]/g, '_')}_storybook.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error downloading storybook:', error);
    res.status(500).json({ 
      message: 'Failed to download storybook',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;
