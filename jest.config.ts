import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  setupFilesAfterEnv: ['./src/test-utils/jest.setup.ts'],
  bail: 1,
  verbose: true,
};

export default config;