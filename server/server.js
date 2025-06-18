// Description: Entry point for the Express server application
// Imports
import app from './app.js';
import { initDb } from './config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// set port
const PORT = process.env.PORT || 8080;

// Start server and initDb only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  initDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Database initialization failed:', err);
    });
}


