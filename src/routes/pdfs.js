const express = require('express');
const router = express.Router();

// Generate PDF for story
router.post('/generate', async (req, res) => {
  try {
    const { story_id } = req.body;
    
    if (!story_id) {
      return res.status(400).json({ message: 'Story ID is required' });
    }

    console.log('Generating PDF for story:', story_id);

    // Simulate PDF generation
    const pdf = {
      id: 'demo-pdf-' + Date.now(),
      story_id,
      file_url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Demo+PDF',
      file_size: 1024000, // 1MB
      generated_at: new Date().toISOString(),
      version: '1.0',
      is_latest: true
    };

    res.json({
      message: 'PDF generated successfully',
      pdf
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

// Get PDFs for a story
router.get('/story/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    console.log('Fetching PDFs for story:', storyId);

    // Return demo PDFs
    const demoPdfs = [
      {
        id: 'demo-pdf-1',
        story_id: storyId,
        file_url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Demo+PDF+1',
        file_size: 1024000,
        generated_at: new Date().toISOString(),
        version: '1.0',
        is_latest: true
      }
    ];

    res.json({
      pdfs: demoPdfs
    });
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ message: 'Failed to fetch PDFs' });
  }
});

module.exports = router;
