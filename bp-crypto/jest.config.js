// jest.config.js
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	// Add this line to ignore the mocks directory
	testPathIgnorePatterns: [
		'<rootDir>/node_modules/', // Default ignore pattern, good to keep
		'<rootDir>/src/__tests__/mocks/' // Ignore our specific mocks directory
	],
	// Optional: specify test file pattern (defaults are usually fine now)
	// testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
};
