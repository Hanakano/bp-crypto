import { jest } from '@jest/globals';
import { encrypt } from '../actions/encrypt';
import { mockLogger, resetMockLogger } from './mocks/logger';
import { RuntimeError } from '@botpress/client';
import crypto from 'crypto';

// Mock crypto.randomBytes to make IV predictable for tests
const MOCK_IV = Buffer.from('abcdefghijklmnop'); // 16 bytes for aes-256-cbc
let randomBytesSpy: ReturnType<typeof jest.spyOn>; // More specific inferred type

describe('encrypt action', () => {
	const testData = 'my secret data';
	const algorithm = 'aes-256-cbc';
	// Generate a valid 32-byte key for aes-256 and base64 encode it
	const rawKey = crypto.randomBytes(32);
	const base64Key = rawKey.toString('base64');

	beforeAll(() => {
		// Spy on crypto.randomBytes and mock its implementation
		randomBytesSpy = jest.spyOn(crypto, 'randomBytes');
	});

	beforeEach(() => {
		resetMockLogger();
		// Reset the mock before each test to return the fixed IV
		randomBytesSpy.mockClear().mockReturnValue(MOCK_IV);
	});

	afterAll(() => {
		// Restore the original implementation after all tests in this suite
		randomBytesSpy.mockRestore();
	});

	it('should correctly encrypt data using specified algorithm and key', async () => {
		const result = await encrypt({
			input: { data: testData, key: base64Key, algorithm },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "encrypt",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toHaveProperty('output');
		expect(typeof result.output).toBe('string');

		// Verify the output structure (IV + encrypted data, base64 encoded)
		const outputBuffer = Buffer.from(result.output, 'base64');
		const ivFromOutput = outputBuffer.subarray(0, MOCK_IV.length);
		const encryptedDataFromOutput = outputBuffer.subarray(MOCK_IV.length);

		expect(ivFromOutput).toEqual(MOCK_IV); // Check if the predictable IV is at the start

		// Optional: Decrypt to verify correctness (though covered by decrypt test)
		const decipher = crypto.createDecipheriv(algorithm, rawKey, MOCK_IV);
		let decrypted = decipher.update(encryptedDataFromOutput);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		expect(decrypted.toString('utf8')).toBe(testData);

		expect(mockLogger.forBot).toHaveBeenCalled();
		expect(mockLogger.debug).toHaveBeenCalled();
		expect(randomBytesSpy).toHaveBeenCalledWith(16); // Ensure randomBytes was called for IV
	});

	it('should return empty string and log warning if data is missing', async () => {
		const result = await encrypt({
			input: { data: "", key: base64Key, algorithm },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "encrypt",
			metadata: {
				setCost: () => { return 0 }
			},
		});
		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('data is a blank or falsy parameter. Returning empty string!');
	});

	it('should return empty string and log warning if key is missing', async () => {
		const result = await encrypt({
			input: { data: testData, key: '', algorithm },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "encrypt",
			metadata: {
				setCost: () => { return 0 }
			},
		});
		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('key is a blank or falsy parameter. Returning empty string!');
	});

	it('should return empty string and log warning if algorithm is missing', async () => {
		const result = await encrypt({
			input: { data: testData, key: base64Key, algorithm: undefined },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "encrypt",
			metadata: {
				setCost: () => { return 0 }
			},
		});
		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('algorithm is a blank or falsy parameter. Returning empty string!');
	});

	it('should throw RuntimeError for an invalid base64 key', async () => {
		const invalidKey = 'this is not base64';
		await expect(
			encrypt({
				input: { data: testData, key: invalidKey, algorithm },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "encrypt",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(RuntimeError);
		// Error message might vary slightly based on Node version / crypto internals
		await expect(
			encrypt({
				input: { data: testData, key: invalidKey, algorithm },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "encrypt",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(/Error encrypting data: RangeError: Invalid key length/); // Catch common errors
	});
});
