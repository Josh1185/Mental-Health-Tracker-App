// This file contains logic for auth routes
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Registration controller
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Retrieve request body payload

    const existingUser = await User.findOne({ email }); // Check if there is already a user with that email
    if (existingUser) return res.status(409).json({ message: 'A user with that email already exists.' });

    const newUser = new User({ name, email, password }); // Insert input credentials to the collection
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

    res.status(202).json({ // Send token and user data upon successful login
      message: 'Login successful.',
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Password reset request controller
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body; // Retrieve email from request
    const user = await User.findOne({ email }); // Check if that email exists

    // Send confirmation even if the email doesn't exist
    if (!user) return res.status(200).json({ message: "Reset link has been sent to the email address." });

    // Generate token and expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create a transporter for sending reset links to emails 
    let transporter;
    let resetLink;

    // Use nodemailer test account for development and testing
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`; // Create reset link
    }
    else if (process.env.NODE_ENV === 'production') {
      // PRODUCTION NOTE: In production, you would use a real email service provider
      // PRODUCTION NOTE: will be added later
    }

    // Send email with reset link
    const info = await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Reset your password: ${resetLink}`,
      html: `<p>Reset your password: <a href="${resetLink}">Click here</a></p>`,
    });

    // Log the preview URL when in development or testing environment
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    res.status(200).json({ message: 'Reset link has been sent to the email address.' });
  }
  catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again later.' })
  }
}

// Password reset controller
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body; // Retrieve token and new password from request
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    // Hash the token to compare with the stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user and verify that the token is not expired
    const user = await User.findOne({ 
      resetToken: hashedToken,
      resetTokenExpires: { $gt: Date.now() } // Check if the token is still valid
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    // Update the user's password
    user.password = newPassword; // Set new password (it will be hashed automatically by the pre-save hook)
    user.resetToken = undefined; // Clear reset token
    user.resetTokenExpires = undefined; // Clear reset token expiration
    await user.save(); // Save the updated user

    res.status(200).json({ message: 'Password has been reset successfully.' });
  }
  catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
}