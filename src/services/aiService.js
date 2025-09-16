const OpenAI = require('openai');

// Initialize OpenAI client (backup) - only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.warn('OpenAI client initialization failed:', error.message);
  }
}

// Pollinations.AI configuration (no API key required!)
const POLLINATIONS_CONFIG = {
  textApiUrl: 'https://text.pollinations.ai',
  imageApiUrl: 'https://image.pollinations.ai/prompt'
};

class AIService {
  constructor() {
    this.openai = openai;
  }

  /**
   * Generate a story using real AI (Hugging Face or OpenAI)
   */
  async generateStory(storyParams) {
    try {
      const { theme, art_style, character_name, character_age, character_gender, target_age } = storyParams;
      
      // Create detailed prompt for AI story generation
      const storyPrompt = this.createStoryPrompt(storyParams);
      
      let storyContent;
      
      // Use Pollinations.AI for story generation (no API key required!)
      console.log('🤖 Generating story with Pollinations.AI...');
      console.log(`   Using: ${POLLINATIONS_CONFIG.textApiUrl}`);
      storyContent = await this.generatePollinationsStory(storyPrompt);
      
      return {
        title: `${character_name || 'Alex'}'s ${theme} Adventure`,
        content: storyContent,
        theme,
        art_style,
        character_name: character_name || 'Alex',
        character_age: character_age || 10,
        character_gender: character_gender || 'non-binary',
        target_age: target_age || '5-10',
        word_count: storyContent.split(' ').length,
        reading_time_minutes: Math.ceil(storyContent.split(' ').length / 200),
        provider: 'ai-generated'
      };
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  }

  /**
   * Create detailed prompt for AI story generation
   */
  createStoryPrompt(storyParams) {
    const { theme, art_style, character_name, character_age, character_gender, target_age } = storyParams;
    
    const ageGroup = character_age < 6 ? 'toddler' : character_age < 10 ? 'child' : 'preteen';
    const genderPronoun = character_gender === 'male' ? 'he' : character_gender === 'female' ? 'she' : 'they';
    const genderPossessive = character_gender === 'male' ? 'his' : character_gender === 'female' ? 'her' : 'their';
    
    return `Write a creative children's story for a ${ageGroup} aged ${character_age} years old. 

Character: ${character_name} (${character_gender})
Theme: ${theme}
Art Style: ${art_style}
Target Age: ${target_age}

Requirements:
- Write exactly 5 sentences, each describing a different scene
- Use ${genderPronoun}/${genderPossessive} pronouns consistently
- Include specific visual details that would make great illustrations
- Make it age-appropriate and engaging
- Include adventure, friendship, and positive values
- Each sentence should be a complete scene for illustration
- Create a complete story with beginning, middle, and end
- Each sentence should be detailed enough for a full page illustration
- Include specific actions, emotions, and visual elements
- Mention objects, settings, and characters that can be illustrated
- Use descriptive language that paints a clear picture

Story:`;
  }

  /**
   * Generate story using OpenAI
   */
  async generateOpenAIStory(prompt) {
    if (!this.openai) {
      throw new Error('OpenAI client not configured');
    }

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative children's book author. Write engaging, age-appropriate stories with vivid visual descriptions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.8
    });

    return response.choices[0].message.content.trim();
  }

  /**
   * Generate an illustration using Pollinations.AI (no API key required!)
   */
  async generateIllustration(prompt, artStyle) {
    try {
      console.log('🎨 Generating AI image with Pollinations.AI...');
      const enhancedPrompt = this.enhancePromptForStyle(prompt, artStyle);
      const imageUrl = await this.generatePollinationsImage(enhancedPrompt, artStyle);
      
      return {
        image_url: imageUrl,
        prompt: enhancedPrompt,
        style: artStyle,
        dimensions: { width: 512, height: 512 },
        provider: 'pollinations-ai'
      };
    } catch (error) {
      console.error('Error generating illustration:', error);
      throw new Error(`AI image generation failed: ${error.message}. Please check your internet connection.`);
    }
  }

  /**
   * Generate story using Pollinations.AI
   */
  async generatePollinationsStory(prompt) {
    try {
      // Encode the prompt for URL
      const encodedPrompt = encodeURIComponent(prompt);
      const apiUrl = `${POLLINATIONS_CONFIG.textApiUrl}/${encodedPrompt}`;
      
      console.log(`🔗 Pollinations.AI URL: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      if (!response.ok) {
        throw new Error(`Pollinations.AI API error: ${response.status} - ${response.statusText}`);
      }

      const generatedText = await response.text();
      console.log('✅ Pollinations.AI response received');
      console.log(`📝 Generated text length: ${generatedText.length} characters`);
      
      return generatedText.trim();
    } catch (error) {
      console.error('❌ Pollinations.AI text generation error:', error.message);
      throw new Error(`Pollinations.AI text generation failed: ${error.message}`);
    }
  }

  async generatePollinationsImage(prompt, artStyle) {
    try {
      // Encode the prompt for URL
      const encodedPrompt = encodeURIComponent(prompt);
      const apiUrl = `${POLLINATIONS_CONFIG.imageApiUrl}/${encodedPrompt}`;
      
      console.log(`🔗 Pollinations.AI Image URL: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'image/png'
        }
      });

      if (!response.ok) {
        throw new Error(`Pollinations.AI API error: ${response.status} - ${response.statusText}`);
      }

      // Convert response to base64 data URL
      const imageBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');
      const mimeType = 'image/png';
      
      console.log('✅ Pollinations.AI image generated successfully');
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('❌ Pollinations.AI image generation error:', error.message);
      throw new Error(`Pollinations.AI image generation failed: ${error.message}`);
    }
  }

  /**
   * Enhance prompt based on art style
   */
  enhancePromptForStyle(prompt, artStyle) {
    const styleEnhancements = {
      'Fantasy': 'fantasy art, magical, whimsical, detailed, vibrant colors, children\'s book illustration style',
      'Realistic': 'photorealistic, detailed, natural lighting, high quality, professional photography',
      'Cartoon': 'cartoon style, colorful, fun, animated, children\'s cartoon, simple shapes',
      'Watercolor': 'watercolor painting, soft colors, artistic, hand-painted, gentle brushstrokes',
      'Digital Art': 'digital art, modern, clean, vector style, contemporary illustration',
      'Anime': 'anime style, manga, Japanese animation, detailed, expressive',
      'Sketch': 'pencil sketch, line art, black and white, artistic drawing, hand-drawn'
    };

    const enhancement = styleEnhancements[artStyle] || 'artistic, high quality, detailed';
    return `${prompt}, ${enhancement}, children's book illustration, safe for children, appropriate content`;
  }

  /**
   * Generate a story with illustrations (complete workflow)
   */
  async generateCompleteStory(storyParams) {
    try {
      // Generate the story
      const story = await this.generateStory(storyParams);
      
      // Split story into chapters (simple approach)
      const chapters = this.splitStoryIntoChapters(story.content);
      
      // Generate illustrations for each chapter (limit to 5 images for 5 pages)
      const maxImages = 5;
      const chaptersWithIllustrations = [];
      for (let i = 0; i < Math.min(chapters.length, maxImages); i++) {
        const chapter = chapters[i];
        const illustrationPrompt = this.generateIllustrationPrompt(chapter, story.theme, story.art_style);
        
        try {
          const illustration = await this.generateIllustration(illustrationPrompt, story.art_style);
          chaptersWithIllustrations.push({
            ...chapter,
            illustration_url: illustration.image_url,
            illustration_prompt: illustrationPrompt
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

      return {
        ...story,
        chapters: chaptersWithIllustrations
      };
    } catch (error) {
      console.error('Error generating complete story:', error);
      throw error;
    }
  }

  /**
   * Split story into chapters
   */
  splitStoryIntoChapters(storyContent) {
    // Split the 5-8 sentence story into 5 pages (1 sentence per page, max 5 pages)
    const sentences = storyContent.split('.').filter(s => s.trim().length > 0);
    
    const chapters = [];
    const maxPages = 5; // Limit to 5 pages for PDF
    
    for (let i = 0; i < Math.min(sentences.length, maxPages); i++) {
      const sentence = sentences[i].trim() + '.';
      
      if (sentence.trim().length > 0) {
        chapters.push({
          chapter_number: i + 1,
          title: `Page ${i + 1}`,
          content: sentence.trim(),
          word_count: sentence.split(' ').length
        });
      }
    }

    // If no sentences were found, create a single chapter with the full content
    if (chapters.length === 0) {
      return [{
        chapter_number: 1,
        title: 'Page 1',
        content: storyContent,
        word_count: storyContent.split(' ').length
      }];
    }

    return chapters;
  }

  /**
   * Generate detailed illustration prompt from chapter content
   */
  generateIllustrationPrompt(chapter, theme, artStyle) {
    const content = chapter.content.toLowerCase();
    const chapterNumber = chapter.chapter_number || 1;
    
    // Extract character name more accurately from the story content
    const characterMatch = content.match(/(\w+)\s+(put on|discovered|walked|started|found|met|learned|landed|flew|climbed|saw|was|had|felt|looked|smiled|laughed|jumped|ran|played|explored|adventured)/);
    const characterName = characterMatch ? characterMatch[1] : 'the young adventurer';
    
    // Extract specific visual elements and actions from the actual content
    const visualElements = [];
    const actions = [];
    const emotions = [];
    const objects = [];
    
    // Extract emotions and feelings
    if (content.includes('excited') || content.includes('thrilled') || content.includes('happy')) {
      emotions.push('excited and joyful expression');
    }
    if (content.includes('wonder') || content.includes('amazed') || content.includes('surprised')) {
      emotions.push('wondrous and amazed expression');
    }
    if (content.includes('brave') || content.includes('courageous') || content.includes('confident')) {
      emotions.push('brave and confident expression');
    }
    
    // Extract specific objects and items mentioned
    if (content.includes('helmet')) objects.push('space helmet');
    if (content.includes('mask')) objects.push('diving mask');
    if (content.includes('cape')) objects.push('superhero cape');
    if (content.includes('crystal')) objects.push('magical crystal');
    if (content.includes('treasure')) objects.push('treasure chest');
    if (content.includes('door')) objects.push('mysterious door');
    if (content.includes('window')) objects.push('spaceship window');
    
    // Space theme elements - more specific
    if (content.includes('space') || content.includes('rocket') || content.includes('planet') || content.includes('alien') || content.includes('stars')) {
      visualElements.push('twinkling stars', 'colorful planets', 'cosmic nebula', 'space station');
      if (content.includes('blast off') || content.includes('launch')) actions.push('rocket launching with bright flames');
      if (content.includes('window') || content.includes('looking')) actions.push('gazing through spaceship window at space');
      if (content.includes('floating') || content.includes('weightless')) actions.push('floating in zero gravity');
    }
    
    // Underwater theme elements - more specific
    if (content.includes('ocean') || content.includes('fish') || content.includes('diving') || content.includes('coral') || content.includes('sea')) {
      visualElements.push('coral reef', 'colorful tropical fish', 'sea turtles', 'bubbles rising', 'sunlight filtering through water');
      if (content.includes('swam') || content.includes('swimming')) actions.push('swimming gracefully with fish');
      if (content.includes('dolphin')) actions.push('playing with friendly dolphin');
      if (content.includes('treasure')) actions.push('discovering underwater treasure');
    }
    
    // Forest theme elements - more specific
    if (content.includes('forest') || content.includes('tree') || content.includes('owl') || content.includes('squirrel') || content.includes('wood')) {
      visualElements.push('tall ancient trees', 'sunlight filtering through leaves', 'moss-covered rocks', 'glowing mushrooms', 'rustling leaves');
      if (content.includes('walked') || content.includes('walking')) actions.push('walking along forest path');
      if (content.includes('clearing') || content.includes('meadow')) actions.push('discovering magical forest clearing');
      if (content.includes('owl')) actions.push('meeting wise forest owl');
    }
    
    // Mountain theme elements - more specific
    if (content.includes('mountain') || content.includes('climbing') || content.includes('goat') || content.includes('eagle') || content.includes('peak')) {
      visualElements.push('majestic snow-capped mountain', 'pine trees', 'mountain goats', 'eagles soaring', 'rocky cliffs');
      if (content.includes('climbing') || content.includes('hiking')) actions.push('climbing mountain trail');
      if (content.includes('summit') || content.includes('peak')) actions.push('reaching mountain summit');
      if (content.includes('eagle')) actions.push('watching eagles soar');
    }
    
    // Fantasy theme elements - more specific
    if (content.includes('magic') || content.includes('dragon') || content.includes('door') || content.includes('crystal') || content.includes('sparkle')) {
      visualElements.push('glowing magical door', 'shimmering dragon', 'floating islands', 'rainbow bridges', 'magical sparkles');
      if (content.includes('flying') || content.includes('soaring')) actions.push('flying on dragon back');
      if (content.includes('sparkles') || content.includes('magic')) actions.push('casting magical sparkles');
      if (content.includes('door') || content.includes('entrance')) actions.push('opening magical door');
    }
    
    // Superhero theme elements - more specific
    if (content.includes('superhero') || content.includes('cape') || content.includes('fly') || content.includes('powers') || content.includes('hero')) {
      visualElements.push('superhero cape flowing', 'city skyline', 'heroic pose', 'helping others', 'bright city lights');
      if (content.includes('flying') || content.includes('soaring')) actions.push('soaring through sky with cape flowing');
      if (content.includes('help') || content.includes('saving')) actions.push('helping people in need');
      if (content.includes('powers') || content.includes('ability')) actions.push('using superpowers');
    }
    
    // Adventure theme elements - more specific
    if (content.includes('adventure') || content.includes('explore') || content.includes('journey') || content.includes('discover')) {
      visualElements.push('adventure gear', 'exploration tools', 'mysterious path', 'adventure backpack');
      if (content.includes('explore') || content.includes('discover')) actions.push('exploring new territory');
      if (content.includes('journey') || content.includes('travel')) actions.push('embarking on journey');
    }
    
    // Art style specific enhancements
    const styleEnhancements = {
      'watercolor': 'soft watercolor painting, gentle brushstrokes, dreamy atmosphere, pastel colors, artistic',
      'cartoon': 'bright cartoon illustration, cheerful colors, fun animated style, children\'s book art, playful',
      'realistic': 'detailed realistic illustration, natural colors, lifelike characters, professional artwork, photorealistic',
      'digital art': 'vibrant digital art, modern style, clean lines, contemporary illustration, crisp',
      'anime': 'anime style illustration, expressive characters, dynamic poses, detailed artwork, Japanese animation style',
      'sketch': 'artistic pencil sketch, creative shading, hand-drawn style, artistic lines, detailed drawing',
      'fantasy': 'fantasy art style, magical, whimsical, detailed, vibrant colors, children\'s book illustration'
    };
    
    const styleEnhancement = styleEnhancements[artStyle] || 'beautiful children\'s book illustration';
    
    // Build the detailed prompt with better structure
    let prompt = `A detailed children's book illustration showing ${characterName}, `;
    
    // Add age-appropriate character description
    prompt += `a young adventurer, `;
    
    // Add emotions if detected
    if (emotions.length > 0) {
      prompt += `with ${emotions.join(' and ')}, `;
    }
    
    // Add actions if detected
    if (actions.length > 0) {
      prompt += `${actions.join(' and ')}. `;
    } else {
      prompt += `in an exciting scene. `;
    }
    
    // Add visual elements
    if (visualElements.length > 0) {
      prompt += `The scene includes ${visualElements.slice(0, 4).join(', ')}. `;
    }
    
    // Add objects if mentioned
    if (objects.length > 0) {
      prompt += `The character is holding or near ${objects.join(' and ')}. `;
    }
    
    // Add theme-specific atmosphere
    const themeAtmosphere = {
      'space': 'cosmic atmosphere with stars and planets',
      'underwater': 'underwater atmosphere with bubbles and sea life',
      'forest': 'enchanted forest atmosphere with magical lighting',
      'mountain': 'majestic mountain atmosphere with fresh air',
      'fantasy': 'magical fantasy atmosphere with sparkles and wonder',
      'superhero': 'heroic atmosphere with city lights and action',
      'adventure': 'exciting adventure atmosphere with exploration'
    };
    
    const atmosphere = themeAtmosphere[theme.toLowerCase()] || 'adventurous atmosphere';
    prompt += `The illustration should capture the ${atmosphere}. `;
    
    // Add art style and quality requirements
    prompt += `The illustration should be in ${styleEnhancement}, `;
    prompt += `suitable for children aged 5-10, with bright, engaging colors, friendly characters, and a magical, adventurous atmosphere. `;
    prompt += `High quality, detailed artwork that brings the story to life and matches the narrative perfectly. `;
    prompt += `The character should be clearly visible and the main focus of the illustration.`;
    
    return prompt;
  }
}

module.exports = new AIService();