// This file contains the user collection schema/model
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// User Collection Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Password reset fields
  resetToken: String,
  resetTokenExpires: Date,
}, 
{ 
  versionKey: false, 
  timestamps: true, // Adds createdAt and updatedAt
});

// Hash Password for entries before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // checks whether the user's password field was changed before saving

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
  catch (err) {
    next(err);
  }
});

// Method for password comparison
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema); // Ensure the model isn't registered multiple times

export default User;