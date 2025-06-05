// Packages
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Route imports
import authRoutes from './routes/authRoutes.js';

// config dotenv
dotenv.config();

// App intialization and port declaration
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to allow CORS from Vite frontend (default port: 5173) and tell the server to use json
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes go here
app.use('/api/auth', authRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.send('API is running');
});

// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));