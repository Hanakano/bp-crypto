import { jest } from '@jest/globals';
import { verifyHmac } from '../actions/verifyHmac';
import { mockLogger, resetMockLogger } from './mocks/logger';
import { RuntimeError } from '@botpress/client';
import crypto from 'crypto';

describe('verifyHmac action', () => {
	const testKey = 'verifymysecret';
	const testData = 'data that was signed';
	const testAlgorithm = 'sha256';
	const correctHmac = crypto.createHmac(testAlgorithm, testKey).update(testData, 'utf8').digest('hex');
	const incorrectHmac = 'obviouslywronghmac12345';

	beforeEach(() => {
		resetMockLogger();
	});

	it('should return valid: true for a correct HMAC', async () => {
		const result = await verifyHmac({
			input: {
				data: testData,
				key: testKey,
				algorithm: testAlgorithm,
				expectedHmac: correctHmac,
			},
			logger: mockLogger as any,
			client: {} as any,
			ctx: {} as any,
			type: "verifyHmac",
			metadata: { setCost: () => 0 },

		});

		expect(result).toEqual({ valid: true });
		expect(mockLogger.forBot).toHaveBeenCalled();
		expect(mockLogger.debug).toHaveBeenCalled();
	});

	it('should return valid: false for an incorrect HMAC', async () => {
		const result = await verifyHmac({
			input: {
				data: testData,
				key: testKey,
				algorithm: testAlgorithm,
				expectedHmac: incorrectHmac,
			},
			logger: mockLogger as any,
			client: {} as any,
			ctx: {} as any,
			type: "verifyHmac",
			metadata: { setCost: () => 0 },
		});

		expect(result).toEqual({ valid: false });
	});

	it('should return empty string and log warning if data is missing', async () => {
		const result = await verifyHmac({
			input: { data: "", key: testKey, algorithm: testAlgorithm, expectedHmac: correctHmac },
			logger: mockLogger as any,
			client: {} as any,
			ctx: {} as any,
			type: "verifyHmac",
			metadata: { setCost: () => 0 },
		});
		expect(result).toEqual({ valid: false });
		expect(mockLogger.warn).toHaveBeenCalledWith('data is a blank or falsy parameter. Returning empty string!');
	});

	it('should return empty string and log warning if key is missing', async () => {
		const result = await verifyHmac({
			input: { data: testData, key: '', algorithm: testAlgorithm, expectedHmac: correctHmac },
			logger: mockLogger as any,
			client: {} as any,
			ctx: {} as any,
			type: "verifyHmac",
			metadata: { setCost: () => 0 },
		});
		expect(result).toEqual({ valid: false });
		expect(mockLogger.warn).toHaveBeenCalledWith('key is a blank or falsy parameter. Returning empty string!');
	});

	it('should return empty string and log warning if algorithm is missing', async () => {
		const result = await verifyHmac({
			input: { data: testData, key: testKey, algorithm: '', expectedHmac: correctHmac },
			logger: mockLogger as any,
			client: {} as any,
			ctx: {} as any,
			type: "verifyHmac",
			metadata: { setCost: () => 0 },
		});
		expect(result).toEqual({ valid: false });
		expect(mockLogger.warn).toHaveBeenCalledWith('algorithm is a blank or falsy parameter. Returning empty string!');
	});

	it('should return empty string and log warning if expectedHmac is missing', async () => {
		const result = await verifyHmac({
			input: { data: testData, key: testKey, algorithm: testAlgorithm, expectedHmac: '' },
			logger: mockLogger as any,
			client: {} as any,
			ctx: {} as any,
			type: "verifyHmac",
			metadata: { setCost: () => 0 },
		});
		expect(result).toEqual({ valid: false });
		expect(mockLogger.warn).toHaveBeenCalledWith('expectedHmac is a blank or falsy parameter. Returning empty string!');
	});

	it('should throw RuntimeError for an invalid algorithm', async () => {
		const invalidAlgorithm = 'invalid-algo-verify';
		await expect(
			verifyHmac({
				input: {
					data: testData,
					key: testKey,
					algorithm: invalidAlgorithm,
					expectedHmac: correctHmac,
				},
				logger: mockLogger as any,
				client: {} as any,
				ctx: {} as any,
				type: "verifyHmac",
				metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(RuntimeError);
		await expect(
			verifyHmac({
				input: {
					data: testData,
					key: testKey,
					algorithm: invalidAlgorithm,
					expectedHmac: correctHmac,
				},
				logger: mockLogger as any,
				client: {} as any,
				ctx: {} as any,
				type: "verifyHmac",
				metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(/Error verifying HMAC: TypeError: Invalid digest: invalid-algo-verify/);
	});
});
