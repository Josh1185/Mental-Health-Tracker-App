import request from "supertest";
import app from '../app.js';
import User from "../models/User.js";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Register Route Test Suite
describe('Auth Route: Register [/api/auth/test/register]', () => {

  // Test proper registration
  it('should register a new user w/ valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/test/register')
      .send({
        name: 'test',
        email: 'testuser@example.com',
        password: 'Test1234'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Registration successful.');
    const user = await User.findOne({ email: 'testuser@example.com' });
    expect(user).not.toBeNull();
    expect(user.name).toBe('test');
    expect(user.password).not.toBe('Test1234'); // should be hashed
  });

  // Test registration with existing email
  it('should not register a new user w/ existing email', async () => {
    // Create a duplicate user
    await User.create({
      name: 'duplicate',
      email: 'testuser@example.com',
      password: 'Test1234'
    });

    // Attempt to register with the same email
    const res = await request(app)
      .post('/api/auth/test/register')
      .send({
        name: 'test',
        email: 'testuser@example.com',
        password: 'Test1234'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'A user with that email already exists.');
  });

  // Test registration with invalid credentials
  it('should not register a new user w/ invalid credentials', async () => {
    // Attempt to register with invalid credentials
    const res = await request(app)
      .post('/api/auth/test/register')
      .send({
        name: 't',
        email: 'invalid',
        password: 'invalid'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'name', msg: 'Name must be at least 2 characters' }),
        expect.objectContaining({ path: 'email', msg: 'Invalid email address' }),
        expect.objectContaining({ path: 'password', msg: 'Password must be at least 8 characters' }),
        expect.objectContaining({ path: 'password', msg: 'Password must contain at least one number, one lowercase, and one uppercase' }),
      ])
    );
  });

  // After each, delete testuser
  afterEach(async () => {
    await User.deleteOne({ email: 'testuser@example.com' });
  });
});

// Login Route Test Suite
describe('Auth Route: Login [/api/auth/test/login]', () => {
  // Delete all users, and insert a dummy user before each test
  beforeEach(async () => {
    await User.create({
      name: 'dummyuser',
      email: 'dummyuser@example.com',
      password: 'Test1234'
    });
  });
  
  // Test valid login
  it('should login a user w/ valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/test/login')
      .send({
        email: 'dummyuser@example.com',
        password: 'Test1234'
      });

    expect(res.statusCode).toBe(202);
    expect(res.body).toHaveProperty('message', 'Login successful.');
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'dummyuser@example.com');
    expect(res.body.user).toHaveProperty('name', 'dummyuser');
  });

  // Test login with non existent email
  it('should not login a user w/ non existent email', async () => {
    const res = await request(app)
      .post('/api/auth/test/login')
      .send({
        email: 'fakeuser@example.com',
        password: 'Test1234'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  // Test login with wrong password
  it('should not login a user w/ wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/test/login')
      .send({
        email: 'dummyuser@example.com',
        password: 'WrongPwd123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  // Test login server side validation
  it('should not login a user w/ invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/test/login')
      .send({
        email: 'invalid',
        password: ''
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'email', msg: 'Invalid email address' }),
        expect.objectContaining({ path: 'password', msg: 'Password is required' }),
      ])
    );
  });

  // After each delete the user
  afterEach(async () => {
    await User.deleteOne({ email: 'dummyuser@example.com' });
  });
});