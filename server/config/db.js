import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// MongoDB client options to set the Stable API version
const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
}

export async function initDb() {

  const env = process.env.NODE_ENV || 'development';

  const uriMap = {
    development: process.env.MONGO_DEV_CONN_STRING,
    test: process.env.MONGO_TEST_CONN_STRING,
    production: process.env.MONGO_PROD_CONN_STRING
  };

  const uri = uriMap[env];
  if (!uri) throw new Error(`Mongo URI not defined for environment: ${env}`);

  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(`Successfully connected to MongoDB database. [Env: ${env}]`);
  }
  catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

// Disconnect from MongoDB for testing and cleanup purposes
export async function disconnectDb() {
  try {
    await mongoose.disconnect();
    console.log('Successfully disconnected from MongoDB.');
  } catch (err) {
    console.error('Error disconnecting from MongoDB:', err);
  }
}