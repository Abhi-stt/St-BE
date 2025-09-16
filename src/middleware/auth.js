const jwt = require('jsonwebtoken');
const { getUserFromToken } = require('../config/supabase');

// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    // Verify token with Supabase
    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(403).json({
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Unable to authenticate the request'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated'
      });
    }

    // Check user role (you can extend this based on your role system)
    const userRole = req.user.role || 'user';
    if (userRole !== requiredRole && userRole !== 'admin') {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Role '${requiredRole}' is required to access this resource`
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource
const requireOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated'
        });
      }

      const resourceId = req.params.id || req.params.storyId || req.params.chapterId;
      if (!resourceId) {
        return res.status(400).json({
          error: 'Resource ID required',
          message: 'Resource ID is missing from the request'
        });
      }

      // Check ownership based on resource type
      let isOwner = false;
      const { supabaseAdmin, TABLES } = require('../config/supabase');

      switch (resourceType) {
        case 'story':
          const { data: story, error: storyError } = await supabaseAdmin
            .from(TABLES.STORIES)
            .select('user_id')
            .eq('id', resourceId)
            .single();
          
          if (storyError) throw storyError;
          isOwner = story.user_id === req.user.id;
          break;

        case 'chapter':
          const { data: chapter, error: chapterError } = await supabaseAdmin
            .from(TABLES.CHAPTERS)
            .select(`
              ${TABLES.STORIES}!inner(user_id)
            `)
            .eq('id', resourceId)
            .single();
          
          if (chapterError) throw chapterError;
          isOwner = chapter.stories.user_id === req.user.id;
          break;

        case 'illustration':
          const { data: illustration, error: illustrationError } = await supabaseAdmin
            .from(TABLES.ILLUSTRATIONS)
            .select(`
              ${TABLES.CHAPTERS}!inner(${TABLES.STORIES}!inner(user_id))
            `)
            .eq('id', resourceId)
            .single();
          
          if (illustrationError) throw illustrationError;
          isOwner = illustration.chapters.stories.user_id === req.user.id;
          break;

        default:
          return res.status(400).json({
            error: 'Invalid resource type',
            message: 'Unsupported resource type for ownership check'
          });
      }

      if (!isOwner) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to access this resource'
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        error: 'Ownership verification failed',
        message: 'Unable to verify resource ownership'
      });
    }
  };
};

// Middleware to check subscription limits
const checkSubscriptionLimit = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated'
      });
    }

    const { supabaseAdmin, TABLES } = require('../config/supabase');
    
    // Get user profile to check subscription
    const { data: profile, error: profileError } = await supabaseAdmin
      .from(TABLES.PROFILES)
      .select('subscription_tier, stories_created, stories_limit')
      .eq('id', req.user.id)
      .single();

    if (profileError) throw profileError;

    // Check if user has reached their story limit
    if (profile.stories_created >= profile.stories_limit) {
      return res.status(429).json({
        error: 'Story limit reached',
        message: `You have reached your limit of ${profile.stories_limit} stories. Please upgrade your subscription to create more stories.`,
        currentUsage: profile.stories_created,
        limit: profile.stories_limit,
        subscriptionTier: profile.subscription_tier
      });
    }

    next();
  } catch (error) {
    console.error('Subscription limit check error:', error);
    return res.status(500).json({
      error: 'Subscription verification failed',
      message: 'Unable to verify subscription limits'
    });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnership,
  checkSubscriptionLimit
};
