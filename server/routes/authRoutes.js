// This file contains the authentication routes
import express from 'express';
import { register, login } from '../controllers/authController.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Rate limiting goes here

// Registration validation goes here
const validateRegister = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    next(); // Continue if no validation errors
  }
];

// Routes go here
router.post('/register', validateRegister, register);
router.post('/login', login);

export default router;
