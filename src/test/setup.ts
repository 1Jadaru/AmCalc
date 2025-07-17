// Test setup file for Jest
import { config } from 'dotenv'
import '@testing-library/jest-dom'
// Polyfills for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Polyfill for setImmediate
if (typeof global.setImmediate === 'undefined') {
  (global as any).setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => global.setTimeout(fn, 0, ...args);
}

// Mock window.URL for CSV export tests
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn(),
  },
});

// Mock document methods for CSV export
Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => ({
    click: jest.fn(),
    href: '',
    download: '',
  })),
});

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn(),
});

Object.defineProperty(document.body, 'removeChild', {
  value: jest.fn(),
});

// Mock window properties for React DOM
Object.defineProperty(window, 'WebkitAnimation', {
  value: undefined,
  writable: true,
});

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
});

// Load environment variables for tests
config({ path: '.env' })

// Global test timeout
jest.setTimeout(10000) 