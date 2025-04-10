import { jest } from '@jest/globals';
import { randomUuid } from '../actions/randomUuid';
import { mockLogger, resetMockLogger } from './mocks/logger';
import { validate as uuidValidate, version as uuidVersion } from 'uuid'; // Use uuid validation

describe('randomUuid action', () => {
	beforeEach(() => {
		resetMockLogger();
	});

	it('should generate a valid v4 UUID', async () => {
		const result = await randomUuid({
			input: {}, // No specific input needed for basic generation
			logger: mockLogger as any,
			client: {} as any,
			ctx: {} as any,
			type: "randomUuid",
			metadata: { setCost: () => 0 },

		});

		expect(result).toHaveProperty('uuid');
		expect(typeof result.uuid).toBe('string');
		expect(uuidValidate(result.uuid)).toBe(true); // Check if it's a valid UUID
		expect(uuidVersion(result.uuid)).toBe(4);    // Check if it's version 4
		expect(mockLogger.forBot).toHaveBeenCalled();
		expect(mockLogger.debug).toHaveBeenCalledWith('Generating random UUID', { input: {} });
	});
});
