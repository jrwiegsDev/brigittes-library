const { body, param } = require('express-validator');

// Validation rules for creating a user
const createUserValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('role')
    .optional()
    .isIn(['admin', 'super-admin'])
    .withMessage('Role must be either admin or super-admin')
];

// Validation rules for updating a user
const updateUserValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  body('role')
    .optional()
    .isIn(['admin', 'super-admin'])
    .withMessage('Role must be either admin or super-admin')
];

// Validation rules for resetting password
const resetPasswordValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Validation rule for user ID param
const userIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID')
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  resetPasswordValidation,
  userIdValidation
};
