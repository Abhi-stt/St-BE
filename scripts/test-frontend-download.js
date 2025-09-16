const express = require('express');
const path = require('path');

// Simple test server to verify the download functionality
const app = express();
const PORT = 3001;

app.use(express.json());

// Mock the story generation endpoint
app.post('/api/ai/generate-story', (req, res) => {
  console.log('📝 Mock story generation request received');
  
  const mockStory = {
    story: {
      title: 'Luna\'s Friendship Adventure',
      content: 'Once upon a time, Luna met a friendly dragon. They became best friends and went on amazing adventures together. They discovered a magical forest full of talking animals. Luna learned that true friendship means helping others. The dragon taught Luna how to be brave and kind.',
      theme: 'Friendship',
      art_style: 'Classic Storybook',
      character_name: 'Luna',
      character_age: 5,
      character_gender: 'female',
      target_age: 'children',
      word_count: 45,
      reading_time_minutes: 1,
      provider: 'pollinations-ai'
    }
  };
  
  res.json(mockStory);
});

// Mock the illustration generation endpoint
app.post('/api/ai/generate-illustration', (req, res) => {
  console.log('🎨 Mock illustration generation request received');
  
  const mockIllustration = {
    illustration: {
      image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      prompt: req.body.prompt,
      style: req.body.art_style,
      dimensions: { width: 512, height: 512 },
      provider: 'pollinations-ai'
    }
  };
  
  res.json(mockIllustration);
});

// Mock the PDF generation endpoint
app.post('/api/ai/generate-pdf', (req, res) => {
  console.log('📄 Mock PDF generation request received');
  
  // Create a simple PDF buffer
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test PDF) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="test_storybook.pdf"');
  res.send(pdfContent);
});

app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   POST /api/ai/generate-story');
  console.log('   POST /api/ai/generate-illustration');
  console.log('   POST /api/ai/generate-pdf');
  console.log('\n💡 Use this server to test the frontend download functionality');
  console.log('   Update your frontend to use http://localhost:3001 instead of http://localhost:8000');
});

