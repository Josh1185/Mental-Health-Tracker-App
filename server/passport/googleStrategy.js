import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URI,
  }, async (accessToken, refreshToken, profile, done) => {

    try {
      // Obtain user profile information
      const email = profile.emails[0].value;
      const name = profile.displayName;
      // MIGHT USE LATER: const googleId = profile.id;
      // MIGHT USE LATER: const picture = Profiler.photos[0].value;

      // Check if user already exists in the database
      let user = await User.findOne({ email: email});

      if (!user) {
        // If user does not exist, create a new user
        user = new User({
          email: email,
          name: name,
          password: bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10) // Generate a random password for OAuth users
        });

        // Save the new user to the database
        await user.save();
      }

      done(null, { id: user._id });
    }
    catch (err) {
      done(err, null);
    }
  }));
}
