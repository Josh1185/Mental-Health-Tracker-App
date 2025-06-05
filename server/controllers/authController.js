// This file contains logic for auth routes
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Registration controller
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Retrieve request body payload

    const existingUser = await User.findOne({ email }); // Check if there is already a user with that email
    if (existingUser) return res.status(400).json({ message: 'A user with that email already exists.' });

    const newUser = new User({ username, email, password }); // Insert input credentials to the collection
    await newUser.save(); // Await for the user to be saved

    res.status(201).json({ message: 'Registration successful.' });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Retrieve request body payload

    const user = await User.findOne({ email }); // Check if that email exists
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const passwordMatch = await user.comparePassword(password); // Check if the entered password matches
    if (!passwordMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ // Send token and user data upon successful login
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}