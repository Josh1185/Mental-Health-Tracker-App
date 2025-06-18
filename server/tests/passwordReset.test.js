import request from "supertest";
import app from '../app.js';
import User from '../models/User.js';
import crypto from 'crypto';
import { describe, it, expect, beforeEach } from "vitest";

describe('Auth Route: Password Reset Integration [/api/auth/test/reset-password]', () => {
  const userEmail = 'resetPwdTest@example.com'; // Testing email
  const userName = 'ResetPwdTest'; // Testing name
  const originalPwd = 'OldPass123'; // Pwd before reset
  const newPwd = 'NewPass123'; // Pwd after reset
  let rawResetToken; // Raw token placeholder

  let user;
  beforeEach(async () => {
    // Clean up DB
    await User.deleteMany({});

    // Register a real user
    const registerRes = await request(app)
      .post('/api/auth/test/register')
      .send({
        name: userName,
        email: userEmail,
        password: originalPwd
      });
    expect(registerRes.statusCode).toBe(201);

    // Manually generate and hash the reset token (hashed one goes to the db)
    rawResetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');

    // Set the reset token for the newly register user
    user = await User.findOne({ email: userEmail });
    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 1000 * 60 * 10 // 10 mins from current time
    await user.save();
    // Ensure the save is committed by forcing a read
    // await User.findOne({ _id: user._id });
  });

  // Test reset with valid token
  it('should reset password w/ valid token and allow login with new password', async () => {
    // Send password reset request
    const resetPwdRes = await request(app)
      .post('/api/auth/test/reset-password')
      .send({
        token: rawResetToken, // Pass raw token (the controller will hash it and compare with the db one)
        newPassword: newPwd
      });
    expect(resetPwdRes.statusCode).toBe(200);
    expect(resetPwdRes.body).toHaveProperty('message', 'Password has been reset successfully.');

    // Login with new password
    const loginRes = await request(app)
      .post('/api/auth/test/login')
      .send({
        email: userEmail,
        password: newPwd
      });
    expect(loginRes.statusCode).toBe(202);
    expect(loginRes.body).toHaveProperty('message', 'Login successful.');
    expect(loginRes.body.user).toHaveProperty('email', userEmail);
  }, 5000);
});