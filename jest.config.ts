import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './', // Indica la ruta base del proyecto Next.js
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Ajusta si usas rutas absolutas o aliases
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

export default createJestConfig(customJestConfig);
