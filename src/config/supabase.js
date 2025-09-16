const { createClient } = require('@supabase/supabase-js');

// Supabase client for server-side operations (with service role key)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Supabase client for client-side operations (with anon key)
const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Database connection pool configuration
const dbConfig = {
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Storage bucket names
const STORAGE_BUCKETS = {
  ILLUSTRATIONS: 'illustrations',
  PDFS: 'pdfs',
  AVATARS: 'avatars',
  STORY_ASSETS: 'story-assets'
};

// Storage bucket policies (for reference)
const STORAGE_POLICIES = {
  ILLUSTRATIONS: {
    public: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  PDFS: {
    public: false,
    allowedMimeTypes: ['application/pdf'],
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
  AVATARS: {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  STORY_ASSETS: {
    public: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxFileSize: 25 * 1024 * 1024, // 25MB
  }
};

// Database table names
const TABLES = {
  PROFILES: 'profiles',
  STORIES: 'stories',
  CHAPTERS: 'chapters',
  ILLUSTRATIONS: 'illustrations',
  PDFS: 'pdfs',
  STORY_TAGS: 'story_tags',
  USER_FAVORITES: 'user_favorites',
  GENERATION_LOGS: 'generation_logs',
  AI_USAGE: 'ai_usage'
};

// Helper function to get authenticated user from JWT
const getUserFromToken = async (token) => {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};

// Helper function to check if user exists in profiles table
const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLES.PROFILES)
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Helper function to create user profile if it doesn't exist
const createUserProfileIfNotExists = async (user) => {
  try {
    const existingProfile = await getUserProfile(user.id);
    if (existingProfile) return existingProfile;

    const { data, error } = await supabaseAdmin
      .from(TABLES.PROFILES)
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

module.exports = {
  supabaseAdmin,
  supabaseClient,
  dbConfig,
  STORAGE_BUCKETS,
  STORAGE_POLICIES,
  TABLES,
  getUserFromToken,
  getUserProfile,
  createUserProfileIfNotExists
};
