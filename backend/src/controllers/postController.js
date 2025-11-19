const BlogPost = require('../models/BlogPost');

// @desc    Get all published blog posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const { tag, page = 1, limit = 10 } = req.query;

    // Build query - only show published posts to public
    const query = { status: 'published' };

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const posts = await BlogPost.find(query)
      .sort('-publishedAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username')
      .select('-likedBy'); // Don't send IP addresses to client

    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts including drafts (admin only)
// @route   GET /api/posts/admin/all
// @access  Private
const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get all posts regardless of status
    const posts = await BlogPost.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username')
      .select('-likedBy');

    const total = await BlogPost.countDocuments();

    res.json({
      success: true,
      count: posts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published' 
    })
      .populate('author', 'username')
      .select('-likedBy');

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID (admin)
// @route   GET /api/posts/admin/:id
// @access  Private
const getPostById = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'username')
      .select('-likedBy');

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    // Add the author
    req.body.author = req.user._id;

    const post = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    let post = await BlogPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // If changing to published and no publishedAt, set it
    if (req.body.status === 'published' && !post.publishedAt) {
      req.body.publishedAt = new Date();
    }

    post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    await post.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a blog post
// @route   POST /api/posts/:id/like
// @access  Public (rate limited)
const likePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Get IP address (consider using a more robust method in production)
    const ip = req.ip || req.connection.remoteAddress;

    // Check if this IP already liked the post
    if (post.likedBy.includes(ip)) {
      res.status(400);
      throw new Error('You have already liked this post');
    }

    // Add like
    post.likes += 1;
    post.likedBy.push(ip);

    await post.save();

    res.json({
      success: true,
      data: {
        likes: post.likes
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getAllPosts,
  getPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost
};
