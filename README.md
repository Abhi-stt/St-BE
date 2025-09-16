# StoryTeller Backend API

A comprehensive Node.js backend for the StoryTeller platform, featuring AI-powered story generation, illustration creation, and comprehensive story management.

## 🚀 Features

- **AI-Powered Story Generation**: OpenAI GPT-4 integration for creating engaging children's stories
- **AI Image Generation**: Replicate integration with DreamShaper XL Turbo for high-quality illustrations
- **User Authentication**: JWT-based authentication with Supabase Auth
- **Story Management**: Complete CRUD operations for stories, chapters, and illustrations
- **PDF Generation**: Automated PDF creation from story content
- **File Storage**: Supabase Storage for images and PDFs
- **Real-time Generation Tracking**: Monitor AI generation progress
- **Usage Analytics**: Track AI model usage and costs

## 🏗️ Architecture

- **Framework**: Express.js with Node.js
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth + JWT middleware
- **File Storage**: Supabase Storage buckets
- **AI Services**: OpenAI (text), Replicate (images)
- **Validation**: Joi schema validation
- **Error Handling**: Centralized error handling with custom error classes

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase project with PostgreSQL database
- OpenAI API key for text generation
- Replicate API token for image generation
- JWT secret for token signing

## 🛠️ Installation

1. **Clone and install dependencies:**
   ```bash
   cd BE
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenAI Configuration (for text generation)
   OPENAI_API_KEY=your_openai_api_key

   # Replicate Configuration (for image generation)
   REPLICATE_API_TOKEN=your_replicate_api_token
   REPLICATE_API_URL=https://api.replicate.com/v1

   # Server Configuration
   PORT=8080
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Set up database:**
   ```bash
   # Run migration script to create storage buckets
   node src/database/migrate.js
   
   # Apply SQL schema in Supabase dashboard
   # Copy content from src/database/schema.sql
   ```

4. **Start the server:**
   ```bash
   npm start          # Production
   npm run dev        # Development with nodemon
   ```

## 🗄️ Database Schema

### Core Tables
- **profiles**: User profiles and subscription info
- **stories**: Story metadata and settings
- **chapters**: Individual story chapters
- **illustrations**: Generated images for chapters
- **pdfs**: Generated PDF documents
- **generation_logs**: AI generation tracking with Replicate integration
- **ai_model_usage**: Usage analytics for different AI models

### Key Features
- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic timestamps**: `created_at` and `updated_at` fields
- **Replicate Integration**: `replicate_prediction_id`, `output_url`, `model_name`
- **Cost Tracking**: Monitor AI usage costs per user

## 🔐 Authentication Flow

1. **Registration**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → Returns JWT token
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Token Refresh**: `POST /api/auth/refresh`

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh JWT token
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Stories (`/api/stories`)
- `POST /` - Create new story
- `GET /` - Get user's stories (paginated)
- `GET /:id` - Get specific story
- `PUT /:id` - Update story
- `DELETE /:id` - Delete story
- `GET /public` - Discover public stories

### AI Generation (`/api/ai`)
- `POST /generate-story` - Generate story with OpenAI GPT-4
- `POST /generate-illustration` - Start image generation with Replicate
- `GET /illustration-status/:prediction_id` - Check generation progress

### Chapters (`/api/chapters`)
- `POST /` - Create chapter
- `GET /story/:story_id` - Get all chapters for a story
- `PUT /:id` - Update chapter
- `DELETE /:id` - Delete chapter

### Illustrations (`/api/illustrations`)
- `GET /story/:story_id` - Get illustrations for a story
- `POST /regenerate/:id` - Regenerate illustration
- `DELETE /:id` - Delete illustration

### PDFs (`/api/pdfs`)
- `POST /generate` - Generate PDF from story
- `GET /story/:story_id` - Get PDFs for a story
- `GET /download/:id` - Download PDF

### Users (`/api/users`)
- `GET /dashboard` - Get user dashboard data
- `GET /favorites` - Get user's favorite stories
- `POST /favorites/:story_id` - Add to favorites
- `DELETE /favorites/:story_id` - Remove from favorites

## 🎨 AI Integration

### Text Generation (OpenAI)
- **Model**: GPT-4
- **Features**: Story creation, chapter generation, character development
- **Cost Tracking**: Per-token usage monitoring

### Image Generation (Replicate)
- **Model**: DreamShaper XL Turbo
- **Features**: High-quality story illustrations, art style customization
- **Free Tier**: 500 images/month
- **Cost**: $0.002-0.01 per image after free tier
- **Generation Time**: 2-5 minutes per image

### Generation Workflow
1. **Start Generation**: Send prompt to Replicate API
2. **Get Prediction ID**: Track generation progress
3. **Poll Status**: Check completion status every 5 seconds
4. **Download & Store**: Automatically save to Supabase Storage
5. **Create Records**: Update database with generated content

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Row Level Security**: Database-level access control
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schema validation
- **CORS Protection**: Configurable cross-origin policies
- **Helmet Security**: HTTP security headers

## 📊 Monitoring & Analytics

- **Generation Logs**: Track all AI generation attempts
- **Usage Analytics**: Monitor AI model usage and costs
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Configure Supabase production project
3. Set up proper CORS origins
4. Configure rate limiting for production

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "auth"
```

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Supabase project URL | ✅ | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ | - |
| `REPLICATE_API_TOKEN` | Replicate API token | ✅ | - |
| `OPENAI_API_KEY` | OpenAI API key | ✅ | - |
| `JWT_SECRET` | JWT signing secret | ✅ | - |
| `PORT` | Server port | ❌ | 8080 |
| `NODE_ENV` | Environment mode | ❌ | development |

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 📚 Getting Started Examples

### Generate a Story
```bash
curl -X POST http://localhost:8080/api/ai/generate-story \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "friendship",
    "art_style": "watercolor",
    "character_name": "Luna",
    "character_age": 8,
    "target_age": "children"
  }'
```

### Generate an Illustration
```bash
curl -X POST http://localhost:8080/api/ai/generate-illustration \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "story_id": "STORY_UUID",
    "chapter_id": "CHAPTER_UUID",
    "prompt": "A magical forest with glowing mushrooms",
    "art_style": "watercolor"
  }'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review error logs
- Check Supabase dashboard for database issues
- Verify environment variables are set correctly

## 🔄 Changelog

### v1.0.0
- Initial release with OpenAI and Replicate integration
- Complete story management system
- AI-powered illustration generation
- PDF generation capabilities
- Comprehensive user authentication
- Row Level Security implementation
