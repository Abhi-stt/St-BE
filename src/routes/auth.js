const express = require('express');
const router = express.Router();
const { supabaseAdmin, supabaseClient, TABLES, createUserProfileIfNotExists } = require('../config/supabase');

// Real login with Supabase authentication
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Login attempt for:', email);
    
    // Authenticate with Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error('Login error:', error.message);
      return res.status(401).json({ 
        message: 'Invalid email or password',
        error: error.message 
      });
    }

    if (!data.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Ensure user profile exists
    const userProfile = await createUserProfileIfNotExists(data.user);

    res.json({
      message: 'Login successful',
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: userProfile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
        avatar_url: userProfile?.avatar_url || data.user.user_metadata?.avatar_url,
        subscription_tier: userProfile?.subscription_tier || 'free',
        stories_created: userProfile?.stories_created || 0,
        stories_limit: userProfile?.stories_limit || 5,
        created_at: data.user.created_at,
        updated_at: userProfile?.updated_at || data.user.updated_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    console.log('Registration attempt for:', email);
    
    // Register with Supabase
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: full_name || email.split('@')[0]
        }
      }
    });

    if (error) {
      console.error('Registration error:', error.message);
      return res.status(400).json({ 
        message: 'Registration failed',
        error: error.message 
      });
    }

    if (!data.user) {
      return res.status(400).json({ message: 'Registration failed' });
    }

    // Create user profile
    const userProfile = await createUserProfileIfNotExists(data.user);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: userProfile?.full_name || full_name || email.split('@')[0],
        subscription_tier: 'free',
        stories_created: 0,
        stories_limit: 5,
        email_confirmed: data.user.email_confirmed_at ? true : false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Demo login endpoint (for testing without real accounts)
router.post('/demo-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Demo login requested for:', email);
    
    // Simple password validation for demo
    const validCredentials = [
      { email: 'demo@storyteller.com', password: 'demo123' },
      { email: 'test@example.com', password: 'test123' },
      { email: 'admin@storyteller.com', password: 'admin123' },
      { email: 'user@demo.com', password: 'user123' }
    ];

    const validCred = validCredentials.find(cred => 
      cred.email === email && cred.password === password
    );

    if (!validCred) {
      return res.status(401).json({ 
        message: 'Invalid email or password',
        hint: 'Try: demo@storyteller.com / demo123'
      });
    }
    
    // Create a demo user profile
    const demoUser = {
      id: 'demo-' + Date.now(),
      email: email,
      full_name: email.split('@')[0] || 'Demo User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subscription_tier: 'free',
      stories_created: 0,
      stories_limit: 5
    };

    // Generate a simple demo token
    const token = 'demo-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    res.json({
      message: 'Demo login successful',
      token: token,
      user: demoUser
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ message: 'Demo login failed' });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  res.json({
    message: 'Logged out successfully'
  });
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from(TABLES.PROFILES)
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({ message: 'Failed to fetch profile' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
        subscription_tier: profile?.subscription_tier || 'free',
        stories_created: profile?.stories_created || 0,
        stories_limit: profile?.stories_limit || 5,
        created_at: user.created_at,
        updated_at: profile?.updated_at || user.updated_at
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Health check for auth routes
router.get('/health', (req, res) => {
  res.json({
    status: 'Auth routes working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
