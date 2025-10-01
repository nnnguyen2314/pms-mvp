import '@testing-library/jest-dom';
import { server } from './src/test/msw/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
