/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {},
   moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    setupFiles: ['<rootDir>/jest.setup.ts'],
};