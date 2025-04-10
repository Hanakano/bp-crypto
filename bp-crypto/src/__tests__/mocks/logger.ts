// src/__tests__/mocks/logger.ts
import { jest } from '@jest/globals';
// Optional: Import the type for better intellisense and type checking of the mock itself
import type { IntegrationLogger } from '@botpress/sdk'; // Adjust path if needed, might be deeper like /dist/...

// Define the mock object
export const mockLogger = {
	// --- Public/Common Methods ---
	forBot: jest.fn().mockReturnThis(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
	// Context methods
	with: jest.fn().mockReturnThis(),
	withConversationId: jest.fn().mockReturnThis(),
	withUserId: jest.fn().mockReturnThis(),
	withInteractionId: jest.fn().mockReturnThis(),
	withOperationId: jest.fn().mockReturnThis(),
	withWorkflowId: jest.fn().mockReturnThis(),
	withNodeId: jest.fn().mockReturnThis(),
	withInstructionId: jest.fn().mockReturnThis(),
	withVisibleToBotOwners: jest.fn().mockReturnThis(),

	// --- Newly Added Properties based on the error ---
	getJsonMessage: jest.fn((level: string, message: string, metadata?: Record<string, any>) => ({ level, message, ...metadata })), // Mock a basic JSON structure
	defaultOptions: jest.fn(() => ({})), // Mock returning an empty options object
	_log: jest.fn(), // Internal logging function
	_serializeMessage: jest.fn((message: any) => JSON.stringify(message)), // Basic serialization mock
	_getConsoleMethod: jest.fn((_level: string) => console.log), // Prefix with underscore
};

// Helper to reset mocks between tests
export const resetMockLogger = () => {
	// Reset all functions
	Object.values(mockLogger).forEach(mockFn => {
		if (jest.isMockFunction(mockFn)) {
			mockFn.mockClear();
		}
	});

	// Ensure chaining methods still return 'this' after reset
	mockLogger.forBot.mockReturnThis();
	mockLogger.with.mockReturnThis();
	mockLogger.withConversationId.mockReturnThis();
	mockLogger.withUserId.mockReturnThis();
	mockLogger.withInteractionId.mockReturnThis();
	mockLogger.withOperationId.mockReturnThis();
	mockLogger.withWorkflowId.mockReturnThis();
	mockLogger.withNodeId.mockReturnThis();
	mockLogger.withInstructionId.mockReturnThis();
	mockLogger.withVisibleToBotOwners.mockReturnThis();

	// Explicitly reset mocks for clarity if needed (though the loop above should cover it)
	// mockLogger.getJsonMessage.mockClear();
	// mockLogger.defaultOptions.mockClear();
	// mockLogger._log.mockClear();
	// mockLogger._serializeMessage.mockClear();
	// mockLogger._getConsoleMethod.mockClear();
};

// Optional but recommended: Assert the mock conforms to the type
// This helps catch future changes in the SDK's logger interface.
// Note: jest.Mocked doesn't always work perfectly with complex interfaces/methods returning 'this'.
// A simple type assertion might be sufficient:
//export const typedMockLogger = mockLogger as jest.Mocked<IntegrationLogger>;
