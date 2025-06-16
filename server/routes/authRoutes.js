// This file contains the authentication routes
import express from 'express';
import { register, login, requestPasswordReset, resetPassword } from '../controllers/authController.js';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const router = express.Router();

// Rate limiting goes here
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 5, // Limit each IP to 5 server requests per windowMs
  message: {
    error: 'Too many attempts. Please try again in 5 mins.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth validation goes here
const validateRegister = [
  // Name validation
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
  // Email validation
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  
  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('Password must contain at least one number, one lowercase, and one uppercase'),

  // Final validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    next(); // Continue if no validation errors
  }
];

const validateLogin = [
  // Email validation
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  
  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required'),

  // Final validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

// Email validation for password reset requests
const validatePasswordResetRequest = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),

  // Final validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

// Password reset validation
const validateResetPassword = [
  body('token')
    .notEmpty().withMessage('Reset token is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('New password must contain at least one number, one lowercase, and one uppercase'),

  // Final validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

// Routes go here
// Register and login routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
// Password reset routes
router.post('/request-password-reset', authLimiter, validatePasswordResetRequest, requestPasswordReset);
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);
// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // Handle successful authentication
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
});

// Routes without rate limiting (for testing purposes)
if (process.env.NODE_ENV === 'test') {
  router.post('/test/register', validateRegister, register);
  router.post('/test/login', validateLogin, login);
  router.post('/test/request-password-reset', validatePasswordResetRequest, requestPasswordReset);
  router.post('/test/reset-password', validateResetPassword, resetPassword);
}

export default router;
