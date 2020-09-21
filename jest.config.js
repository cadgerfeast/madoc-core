module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testMatch: [
    '**/test/**/*.spec.[jt]s?(x)'
  ],
  setupFiles: [
    './test/mocks/setup.js'
  ],
  moduleNameMapper: {
    'register-service-worker': '<rootDir>/test/mocks/register-service-worker.js'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/src/**/*.{js,vue}'
  ]
};
