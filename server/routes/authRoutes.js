// This file contains the authentication routes
import express from 'express';
import { register, login } from '../controllers/authController.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Rate limiting goes here

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
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('Password must contain at least one letter and one number'),

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

// Routes go here
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;
