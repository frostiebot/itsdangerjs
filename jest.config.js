// const path = require('path')

module.exports = {
  rootDir: process.cwd(),
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  // collectCoverage: true,
  collectCoverageFrom: [
    '!**/node_modules/**',
    '!**/index.js',
    'src/**/*.js',
  ],
  reporters: ['default'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js$',
  // testResultsProcessor: './node_modules/jest-html-reporter',
  // transform: {
  //   '^.+\\.js$': path.resolve(__dirname, './babel-jest-transformer.js'),
  // },
  verbose: false,
}
