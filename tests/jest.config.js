//jest config file
module.exports = {
    verbose: true,
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    testPathIgnorePatterns: ['**/node_modules/**', '**/tests/config.js', '**/public/**', '**/private/**', ' **/admin/**', '**/auth/**'],
};