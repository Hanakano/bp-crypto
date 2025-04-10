import { jest } from '@jest/globals';
import { decrypt } from '../actions/decrypt';
import { mockLogger, resetMockLogger } from './mocks/logger';
import { RuntimeError } from '@botpress/client';
import crypto from 'crypto';

describe('decrypt action', () => {
	const algorithm = 'aes-256-cbc';
	const ivLength = 16; // Standard for AES
	const testData = 'my secret data to decrypt';

	// --- Generate test encryption data ---
	let base64Key: string;
	let encryptedBase64Data: string; // Stores Base64(IV + EncryptedText)

	beforeAll(() => {
		// Generate a key and encrypt data once for the tests
		const rawKey = crypto.randomBytes(32); // 32 bytes for aes-256
		base64Key = rawKey.toString('base64');
		const iv = crypto.randomBytes(ivLength); // Real IV for setup

		const cipher = crypto.createCipheriv(algorithm, rawKey, iv);
		let encrypted = cipher.update(testData, 'utf8');
		encrypted = Buffer.concat([encrypted, cipher.final()]);

		// Combine IV and encrypted data, then base64 encode
		encryptedBase64Data = Buffer.concat([iv, encrypted]).toString('base64');
	});
	// --- End test data generation ---


	beforeEach(() => {
		resetMockLogger();
	});

	it('should correctly decrypt data encrypted by the encrypt action', async () => {
		const result = await decrypt({
			input: {
				data: encryptedBase64Data,
				key: base64Key,
				algorithm: algorithm,
				ivLength: ivLength,
			},
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "decrypt",
			metadata: {
				setCost: () => { return 0 }
			},
		});

		expect(result).toEqual({ output: testData });
		expect(mockLogger.warn).not.toHaveBeenCalled(); // Ensure no warnings for valid data
	});

	it('should return empty string and log warning if data is missing', async () => {
		const result = await decrypt({
			input: { data: '', key: base64Key, algorithm, ivLength },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "decrypt",
			metadata: {
				setCost: () => { return 0 }
			},
		});
		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('data is a blank or falsy parameter. Returning empty string!');
	});

	it('should return empty string and log warning if key is missing', async () => {
		const result = await decrypt({
			input: { data: encryptedBase64Data, key: "", algorithm, ivLength },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "decrypt",
			metadata: {
				setCost: () => { return 0 }
			},
		});
		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('key is a blank or falsy parameter. Returning empty string!');
	});

	it('should return empty string and log warning if algorithm is missing', async () => {
		const result = await decrypt({
			input: { data: encryptedBase64Data, key: base64Key, algorithm: undefined, ivLength },
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "decrypt",
			metadata: {
				setCost: () => { return 0 }
			},
		});
		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('algorithm is a blank or falsy parameter. Returning empty string!');
	});

	it('should return empty string and log warning if ivLength is missing', async () => {
		const result = await decrypt({
			input: { data: encryptedBase64Data, key: base64Key, algorithm, ivLength: 0 }, // Use 0 or undefined
			logger: mockLogger as any,
			client: {} as any, // Add dummy client/ctx if needed by bp types
			ctx: {} as any,
			type: "decrypt",
			metadata: {
				setCost: () => { return 0 }
			},
		});
		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith('ivLength is a blank or falsy parameter. Returning empty string!');
	});

	it('should throw RuntimeError for an incorrect key', async () => {
		const wrongRawKey = crypto.randomBytes(32);
		const wrongBase64Key = wrongRawKey.toString('base64');

		await expect(
			decrypt({
				input: { data: encryptedBase64Data, key: wrongBase64Key, algorithm, ivLength },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "decrypt",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(RuntimeError);
	});

	it('should throw RuntimeError for incorrect ivLength or tampered data', async () => {
		const wrongIvLength = 10;

		await expect(
			decrypt({
				input: { data: encryptedBase64Data, key: base64Key, algorithm, ivLength: wrongIvLength },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "decrypt",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(RuntimeError);
		// Tamper the data slightly (e.g., flip a bit in the encrypted part)
		const buffer = Buffer.from(encryptedBase64Data, 'base64');

		// Simplify the check:
		if (buffer.length === 0) {
			throw new Error("Test setup error: encryptedBase64Data resulted in an empty buffer.");
		}
		// If we get here, buffer.length > 0, so buffer.length - 1 >= 0

		// Try the assignment again:
		buffer[buffer.length - 1] = (buffer[buffer.length - 1] || 0) ^ 1; // Flip last bit
		const tamperedData = buffer.toString('base64');

		await expect(
			decrypt({
				input: { data: tamperedData, key: base64Key, algorithm, ivLength },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "decrypt",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(RuntimeError);
	});

	it('should throw RuntimeError for invalid base64 data input', async () => {
		const invalidBase64 = "this is not base64***";
		await expect(
			decrypt({
				input: { data: invalidBase64, key: base64Key, algorithm, ivLength },
				logger: mockLogger as any,
				client: {} as any, // Add dummy client/ctx if needed by bp types
				ctx: {} as any,
				type: "decrypt",
				metadata: {
					setCost: () => { return 0 }
				},
			})
		).rejects.toThrow(RuntimeError);
	});
});
