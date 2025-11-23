const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect, isSuperAdmin } = require('../middleware/auth');

// @route   GET /api/stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/', protect, getStats);

module.exports = router;
