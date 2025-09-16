const { jsPDF } = require('jspdf');
const fetch = require('node-fetch');

class PDFService {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
  }

  /**
   * Generate a complete storybook PDF with story and images
   */
  async generateStorybookPDF(storybook) {
    try {
      const pdf = new jsPDF();
      let currentY = this.margin;
      let pageNumber = 1;

      // Add cover page
      this.addCoverPage(pdf, storybook);
      pdf.addPage();
      pageNumber++;

      // Process each chapter/page
      for (let i = 0; i < storybook.chapters.length; i++) {
        const chapter = storybook.chapters[i];
        
        // Check if we need a new page
        if (currentY > this.pageHeight - 100) {
          pdf.addPage();
          pageNumber++;
          currentY = this.margin;
        }

        // Add chapter content
        currentY = await this.addChapterPage(pdf, chapter, currentY, pageNumber);
      }

      // Add back cover
      pdf.addPage();
      this.addBackCover(pdf, storybook);

      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Add cover page
   */
  addCoverPage(pdf, storybook) {
    // Background color for cover
    pdf.setFillColor(240, 248, 255);
    pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

    // Decorative border
    pdf.setDrawColor(100, 149, 237);
    pdf.setLineWidth(3);
    pdf.rect(15, 15, this.pageWidth - 30, this.pageHeight - 30);

    // Main title with better positioning
    pdf.setFontSize(24); // Reduced from 28 to prevent overflow
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(25, 25, 112); // Dark blue
    const titleY = 80;
    pdf.text(storybook.title, this.pageWidth / 2, titleY, { align: 'center' });

    // Subtitle with better positioning
    pdf.setFontSize(16); // Reduced from 18
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(70, 130, 180); // Steel blue
    const subtitleY = titleY + 20;
    pdf.text(`A ${storybook.theme} Adventure`, this.pageWidth / 2, subtitleY, { align: 'center' });

    // Character illustration placeholder with better positioning
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(100, 149, 237);
    pdf.setLineWidth(2);
    const illustrationWidth = 70; // Reduced size
    const illustrationHeight = 70;
    const illustrationX = (this.pageWidth - illustrationWidth) / 2;
    const illustrationY = subtitleY + 30; // Better spacing
    pdf.rect(illustrationX, illustrationY, illustrationWidth, illustrationHeight, 'FD');

    // Character name in the illustration
    pdf.setFontSize(14); // Reduced from 16
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(25, 25, 112);
    pdf.text(storybook.character_name, this.pageWidth / 2, illustrationY + illustrationHeight / 2 + 5, { align: 'center' });

    // Character details in a nice box with better positioning
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(100, 149, 237);
    pdf.setLineWidth(1);
    const boxWidth = 140; // Increased width
    const boxHeight = 50; // Reduced height
    const boxX = (this.pageWidth - boxWidth) / 2;
    const boxY = illustrationY + illustrationHeight + 20; // Better spacing
    pdf.rect(boxX, boxY, boxWidth, boxHeight, 'FD');

    pdf.setFontSize(11); // Reduced font size
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(70, 130, 180);
    pdf.text(`Character: ${storybook.character_name}`, this.pageWidth / 2, boxY + 12, { align: 'center' });
    pdf.text(`Age: ${storybook.character_age} years old`, this.pageWidth / 2, boxY + 22, { align: 'center' });
    pdf.text(`Art Style: ${storybook.art_style}`, this.pageWidth / 2, boxY + 32, { align: 'center' });

    // Decorative elements with better positioning
    pdf.setFillColor(255, 215, 0); // Gold
    pdf.circle(this.pageWidth / 2 - 50, titleY - 10, 2, 'F');
    pdf.circle(this.pageWidth / 2 + 50, titleY - 10, 2, 'F');
    pdf.circle(this.pageWidth / 2 - 50, subtitleY + 10, 2, 'F');
    pdf.circle(this.pageWidth / 2 + 50, subtitleY + 10, 2, 'F');

    // Footer with better positioning
    pdf.setFontSize(9); // Reduced font size
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Created with StoryTeller AI`, this.pageWidth / 2, this.pageHeight - 25, { align: 'center' });
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, this.pageWidth / 2, this.pageHeight - 15, { align: 'center' });
  }

  /**
   * Add a chapter page with image and text
   */
  async addChapterPage(pdf, chapter, startY, pageNumber) {
    let currentY = startY;

    // Add decorative header
    pdf.setDrawColor(100, 149, 237);
    pdf.setLineWidth(2);
    pdf.line(this.margin, currentY - 5, this.pageWidth - this.margin, currentY - 5);

    // Add page number with decorative styling
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 149, 237);
    pdf.text(`Page ${pageNumber}`, this.pageWidth - this.margin, this.pageHeight - 10);

    // Add chapter title with better styling
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(25, 25, 112);
    pdf.text(chapter.title, this.margin, currentY);
    currentY += 20;

    // Add image if available
    if (chapter.illustration_url) {
      try {
        console.log('Adding image for chapter:', chapter.title);
        const imageData = await this.convertImageToBase64(chapter.illustration_url);
        const imgWidth = this.contentWidth * 0.7;
        const imgHeight = imgWidth * 0.8; // Better aspect ratio for children's books
        
        // Check if image fits on current page
        if (currentY + imgHeight > this.pageHeight - 80) {
          pdf.addPage();
          currentY = this.margin + 20;
        }

        // Add decorative border around image
        pdf.setDrawColor(100, 149, 237);
        pdf.setLineWidth(3);
        const borderPadding = 5;
        pdf.rect(
          this.margin + (this.contentWidth - imgWidth) / 2 - borderPadding, 
          currentY - borderPadding, 
          imgWidth + (borderPadding * 2), 
          imgHeight + (borderPadding * 2), 
          'S'
        );

        // Add the image to PDF
        pdf.addImage(imageData, 'PNG', this.margin + (this.contentWidth - imgWidth) / 2, currentY, imgWidth, imgHeight);
        console.log('Image added successfully');
        currentY += imgHeight + 15;
      } catch (error) {
        console.log('Could not add image:', error.message);
        console.log('Image URL:', chapter.illustration_url ? chapter.illustration_url.substring(0, 100) + '...' : 'null');
        // Add a decorative placeholder instead
        pdf.setFillColor(240, 248, 255);
        pdf.setDrawColor(100, 149, 237);
        pdf.setLineWidth(2);
        const placeholderWidth = this.contentWidth * 0.7;
        const placeholderHeight = placeholderWidth * 0.8;
        pdf.rect(
          this.margin + (this.contentWidth - placeholderWidth) / 2, 
          currentY, 
          placeholderWidth, 
          placeholderHeight, 
          'FD'
        );
        
        // Add text in placeholder
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 149, 237);
        pdf.text('Illustration', this.pageWidth / 2, currentY + placeholderHeight / 2, { align: 'center' });
        currentY += placeholderHeight + 20;
      }
    } else {
      console.log('No image URL for chapter:', chapter.title);
    }

    // Add story text with better formatting
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(25, 25, 112); // Dark blue for better readability
    
    // Add decorative line before text
    pdf.setDrawColor(255, 215, 0);
    pdf.setLineWidth(2);
    pdf.line(this.margin, currentY - 8, this.margin + 60, currentY - 8);
    currentY += 15;
    
    // Split text into lines that fit the page width
    const textLines = pdf.splitTextToSize(chapter.content, this.contentWidth - 20);
    
    for (const line of textLines) {
      // Check if we need a new page
      if (currentY > this.pageHeight - 50) {
        pdf.addPage();
        currentY = this.margin + 20;
      }
      
      pdf.text(line, this.margin + 10, currentY);
      currentY += 10; // Better line spacing for children
    }

    // Add decorative line after text
    pdf.setDrawColor(255, 215, 0);
    pdf.setLineWidth(1);
    pdf.line(this.pageWidth - this.margin - 50, currentY + 5, this.pageWidth - this.margin, currentY + 5);

    return currentY + 20;
  }

  /**
   * Add back cover
   */
  addBackCover(pdf, storybook) {
    // Background color for back cover
    pdf.setFillColor(240, 248, 255);
    pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

    // Decorative border
    pdf.setDrawColor(100, 149, 237);
    pdf.setLineWidth(3);
    pdf.rect(15, 15, this.pageWidth - 30, this.pageHeight - 30);

    // "The End" with better positioning
    pdf.setFontSize(28); // Reduced from 32
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(25, 25, 112);
    const endY = 100; // Better positioning
    pdf.text('The End', this.pageWidth / 2, endY, { align: 'center' });

    // Decorative stars around "The End" with better positioning
    pdf.setFillColor(255, 215, 0);
    pdf.circle(this.pageWidth / 2 - 35, endY - 15, 2, 'F');
    pdf.circle(this.pageWidth / 2 + 35, endY - 15, 2, 'F');
    pdf.circle(this.pageWidth / 2 - 35, endY + 15, 2, 'F');
    pdf.circle(this.pageWidth / 2 + 35, endY + 15, 2, 'F');

    // Story summary in a decorative box with better positioning
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(100, 149, 237);
    pdf.setLineWidth(2);
    const summaryBoxWidth = 160; // Increased width
    const summaryBoxHeight = 70; // Reduced height
    const summaryBoxX = (this.pageWidth - summaryBoxWidth) / 2;
    const summaryBoxY = endY + 40; // Better spacing from "The End"
    pdf.rect(summaryBoxX, summaryBoxY, summaryBoxWidth, summaryBoxHeight, 'FD');

    // Summary text with better spacing
    pdf.setFontSize(12); // Reduced from 14
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    pdf.text(`This ${storybook.theme} adventure`, this.pageWidth / 2, summaryBoxY + 15, { align: 'center' });
    pdf.text(`follows ${storybook.character_name}`, this.pageWidth / 2, summaryBoxY + 28, { align: 'center' });
    pdf.text(`as they discover the power`, this.pageWidth / 2, summaryBoxY + 41, { align: 'center' });
    pdf.text(`of friendship and courage.`, this.pageWidth / 2, summaryBoxY + 54, { align: 'center' });

    // Character age and theme info with better positioning
    pdf.setFontSize(11); // Reduced from 12
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(70, 130, 180);
    const ageInfoY = summaryBoxY + summaryBoxHeight + 20;
    pdf.text(`Perfect for ages ${storybook.character_age} and up`, this.pageWidth / 2, ageInfoY, { align: 'center' });

    // Decorative line with better positioning
    pdf.setDrawColor(255, 215, 0);
    pdf.setLineWidth(2);
    const lineY = ageInfoY + 20;
    pdf.line(this.margin + 20, lineY, this.pageWidth - this.margin - 20, lineY);

    // Footer with better positioning and reduced font sizes
    pdf.setFontSize(10); // Reduced from 11
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 149, 237);
    pdf.text('Created with StoryTeller AI', this.pageWidth / 2, this.pageHeight - 50, { align: 'center' });
    
    pdf.setFontSize(9); // Reduced from 10
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Create your own magical stories', this.pageWidth / 2, this.pageHeight - 38, { align: 'center' });
    pdf.text('at storyteller.ai', this.pageWidth / 2, this.pageHeight - 30, { align: 'center' });
    
    // Generation date with better positioning
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, this.pageWidth / 2, this.pageHeight - 18, { align: 'center' });
  }

  /**
   * Convert image URL to base64
   */
  async convertImageToBase64(imageUrl) {
    try {
      // If it's already a data URL, return it
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }

      // If it's a URL, fetch and convert
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const buffer = await response.buffer();
      const base64 = buffer.toString('base64');
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }

  /**
   * Generate PDF buffer for download
   */
  async generatePDFBuffer(storybook) {
    const pdf = await this.generateStorybookPDF(storybook);
    const buffer = pdf.output('arraybuffer');
    return Buffer.from(buffer);
  }
}

module.exports = new PDFService();
