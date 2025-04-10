import { jest } from '@jest/globals';
import { hmac } from '../actions/hmac';
import { mockLogger, resetMockLogger } from './mocks/logger';
import { RuntimeError } from '@botpress/client';
import crypto from 'crypto';

describe('hmac action', () => {
	const testKey = 'mysecretkey';

	beforeEach(() => {
		resetMockLogger();
	});

	it('should correctly create HMAC using default algorithm (sha256)', async () => {
		// 1. Use the raw object
		const inputData = { payload: 'data to sign', timestamp: Date.now() };
		// 2. Calculate expected HMAC based on stringifying the object
		const dataString = JSON.stringify(inputData);
		const expectedHmac = crypto.createHmac('sha256', testKey).update(dataString, 'utf8').digest('hex');

		const result = await hmac({
			// 3. Pass the raw object to the action
			input: { data: dataString, key: testKey },
			logger: mockLogger as any,
			client: {} as any,
			ctx: {} as any,
			type: "hmac",
			metadata: { setCost: () => 0 },
		});

		// 4. Expect the correctly calculated HMAC
		expect(result).toEqual({ output: expectedHmac });
		expect(mockLogger.forBot).toHaveBeenCalled();
	});

	it('should correctly create HMAC using a specified algorithm (sha512)', async () => {
		const inputData = { message: 'another message' };
		const algorithm = 'sha512';
		const dataString = JSON.stringify(inputData);
		const expectedHmac = crypto.createHmac(algorithm, testKey).update(dataString, 'utf8').digest('hex');

		const result = await hmac({
			input: { data: dataString, key: testKey, algorithm: algorithm },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "hmac",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: expectedHmac });
	});

	it('should return empty string and log warning if data is missing', async () => {
		const result = await hmac({
			input: { data: '', key: testKey, algorithm: 'sha256' },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "hmac",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('data or key is a blank or falsy parameter. Returning empty string!');
	});

	it('should return empty string and log warning if key is missing', async () => {
		const result = await hmac({
			input: { data: JSON.stringify({ a: 1 }), key: '', algorithm: 'sha256' },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "hmac",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('data or key is a blank or falsy parameter. Returning empty string!');
	});

	it('should throw RuntimeError for an invalid algorithm', async () => {
		const inputData = { value: 'test' };
		const invalidAlgorithm = 'invalid-algo-hmac';

		await expect(
			hmac({
				input: { data: JSON.stringify(inputData), key: testKey, algorithm: invalidAlgorithm },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "hmac",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(RuntimeError);
		await expect(
			hmac({
				input: { data: JSON.stringify(inputData), key: testKey, algorithm: invalidAlgorithm },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "hmac",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(/Error creating HMAC: TypeError: Invalid digest: invalid-algo-hmac/);
	});
});
