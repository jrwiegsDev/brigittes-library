const express = require('express');
const router = express.Router();
const {
  getPosts,
  getAllPosts,
  getPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const {
  createPostValidation,
  updatePostValidation,
  postQueryValidation,
  idValidation
} = require('../middleware/validators');
const { likeLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/', postQueryValidation, getPosts);
router.get('/:slug', getPost);
router.post('/:id/like', likeLimiter, idValidation, likePost);

// Protected routes
router.get('/admin/all', protect, postQueryValidation, getAllPosts);
router.get('/admin/:id', protect, idValidation, getPostById);
router.post('/', protect, createPostValidation, createPost);
router.put('/:id', protect, updatePostValidation, updatePost);
router.delete('/:id', protect, idValidation, deletePost);

module.exports = router;
