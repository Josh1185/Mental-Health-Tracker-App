import request from "supertest";
import app from '../server.js';
import User from "../models/User.js";
import { describe, it, expect, afterEach } from "vitest";

// Register Route Test Suite
describe('Auth Route: Register [/api/auth/register]', () => {
  // Delete all users after each test
  afterEach(async () => {
    await User.deleteMany({}); 
  });

  // Test proper registration
  it('should register a new user w/ valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'test',
        email: 'testuser@example.com',
        password: 'Test1234'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Registration successful.');
  });
}); 