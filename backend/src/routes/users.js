const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  resetUserPassword,
  deleteUser
} = require('../controllers/userController');
const { protect, superAdminOnly } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const {
  createUserValidation,
  updateUserValidation,
  resetPasswordValidation,
  userIdValidation
} = require('../middleware/validators/userValidators');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// All routes require authentication and super-admin role
router.use(protect);
router.use(superAdminOnly);

// User CRUD routes
router.route('/')
  .get(getAllUsers)
  .post(createUserValidation, validate, createUser);

router.route('/:id')
  .get(userIdValidation, validate, getUser)
  .put(updateUserValidation, validate, updateUser)
  .delete(userIdValidation, validate, deleteUser);

router.put('/:id/password', resetPasswordValidation, validate, resetUserPassword);

module.exports = router;
