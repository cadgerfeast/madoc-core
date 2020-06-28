module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': 'jest-transform-svelte'
  },
  moduleFileExtensions: [
    'js',
    'json',
    'svelte'
  ],
  testPathIgnorePatterns: ['node_modules'],
  bail: false,
  verbose: true,
  transformIgnorePatterns: ['node_modules'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  setupFiles: [
    '<rootDir>/test/setup.js'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'bin/**/*.js',
    'src/**/*.js',
    'src/**/*.svelte'
  ]
};
