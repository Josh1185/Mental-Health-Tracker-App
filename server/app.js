// Imports
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';

// Passport strategy imports
import './passport/googleStrategy.js';

// Route imports
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;