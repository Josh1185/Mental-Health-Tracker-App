import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: './tests/setup.js', // path to setup file
    maxThreads: 1, // run tests serially
    sequence: {
      concurrent: false, // ensure test files don't overlap
    },
  },
});