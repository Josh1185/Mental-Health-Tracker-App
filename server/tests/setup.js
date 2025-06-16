import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { disconnectDb } from '../config/db.js';
import { beforeAll, afterAll } from 'vitest';

dotenv.config({ path: '.env.test' }); // load test environment variables

// Before all tests, initialize the database
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_TEST_CONN_STRING);
    console.log('Connected to test DB');
  } catch (err) {
    console.error('DB connection error:', err);
    throw err;
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Drop the test database
  await disconnectDb(); // Disconnect from MongoDB
}); 