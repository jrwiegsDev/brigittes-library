const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  getMe
} = require('../controllers/authController');
const { protect, superAdminOnly } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validators');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes (with rate limiting)
router.post('/login', authLimiter, loginValidation, login);
router.post('/refresh', authLimiter, refreshToken);

// Protected routes
router.post('/register', protect, superAdminOnly, registerValidation, register);
router.get('/me', protect, getMe);

module.exports = router;
