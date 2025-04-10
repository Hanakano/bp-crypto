import { jest } from '@jest/globals';
import { hashData } from '../actions/hashData';
import { mockLogger, resetMockLogger } from './mocks/logger';
import { RuntimeError } from '@botpress/client';
import crypto from 'crypto';

describe('hashData action', () => {
	beforeEach(() => {
		resetMockLogger();
	});

	it('should correctly hash data using default algorithm (sha256)', async () => {
		const inputData = JSON.stringify({ user: 'test', id: 123 });
		const expectedHash = crypto.createHash('sha256').update(inputData, 'utf8').digest('hex');

		const result = await hashData({
			input: { data: inputData },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "hashData",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: expectedHash });
		expect(mockLogger.forBot).toHaveBeenCalled();
		expect(mockLogger.debug).toHaveBeenCalledWith('Hashing data with input', { input: { data: inputData } });
	});

	it('should correctly hash data using a specified algorithm (sha512)', async () => {
		const inputData = { value: 'another test' };
		const algorithm = 'sha512';
		const dataString = JSON.stringify(inputData);
		const expectedHash = crypto.createHash(algorithm).update(dataString, 'utf8').digest('hex');

		const result = await hashData({
			input: { data: dataString, algorithm: algorithm },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "hashData",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: expectedHash });
	});

	it('should return empty string and log warning if data is missing', async () => {
		const result = await hashData({
			input: { data: "", algorithm: 'sha256' },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "hashData",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('data is a blank or falsy parameter. Returning empty string!');
	});

	it('should throw RuntimeError for an invalid algorithm', async () => {
		const inputData = JSON.stringify({ value: 'test' });
		const invalidAlgorithm = 'invalid-algo-123';

		await expect(
			hashData({
				input: { data: inputData, algorithm: invalidAlgorithm },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "hashData",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(RuntimeError);
		await expect(
			hashData({
				input: { data: inputData, algorithm: invalidAlgorithm },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "hashData",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(/Error hashing data: Error: Digest method not supported/); // Node's crypto error
	});
});
