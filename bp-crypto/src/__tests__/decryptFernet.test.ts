import { jest } from '@jest/globals';
import { decryptFernet } from '../actions/decryptFernet'; // Adjust path if necessary
import { mockLogger, resetMockLogger } from './mocks/logger'; // Adjust path if necessary
import { RuntimeError } from '@botpress/client';
import fernet from 'fernet'; // Keep the default import for Secret/Token
import crypto from 'crypto'; // Needed for manual key generation

describe('decryptFernet action', () => {
	const testPlaintext = 'This is my secret fernet message';
	let validKey: string;
	let validToken: string;

	// Helper function for URL-safe Base64 encoding needed for Fernet keys
	const generateFernetKey = (): string => {
		const rawKeyBytes = crypto.randomBytes(32);
		// URL-safe base64: replace '+' with '-', '/' with '_', remove padding '='
		return rawKeyBytes.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
	};

	beforeAll(() => {
		// --- CORRECT KEY GENERATION (Manual) ---
		validKey = generateFernetKey();
		const secret = new fernet.Secret(validKey); // Secret constructor needs the encoded key

		// --- CORRECT TOKEN ENCODING (Pass string) ---
		// Encode the actual plaintext string, library handles Buffer conversion
		const tokenInstance = new fernet.Token({ secret });
		validToken = tokenInstance.encode(testPlaintext); // Pass plaintext string directly
	});

	beforeEach(() => {
		resetMockLogger();
	});

	it('should correctly decrypt a valid Fernet token with the correct key', async () => {
		const result = await decryptFernet({
			input: { data: validToken, key: validKey },
			logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
		});

		expect(result).toEqual({ output: testPlaintext });
		expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('[decryptFernet] Successfully decrypted Fernet token.'), expect.any(Object));
	});

	// ... (rest of the tests for missing data/key remain the same) ...
	it('should return empty string and log warning if data is missing', async () => {
		const result = await decryptFernet({
			input: { data: '', key: validKey }, // Test with empty string
			logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
		});
		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('[decryptFernet] Data is a blank or falsy parameter.'));

		mockLogger.warn.mockClear(); // Reset for next check
	});

	it('should return empty string and log warning if key is missing', async () => {
		const result = await decryptFernet({
			input: { data: validToken, key: "" }, // Test with empty string
			logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
		});
		expect(result).toEqual({ output: "" });
		expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('[decryptFernet] Key is a blank or falsy parameter.'));

		mockLogger.warn.mockClear();

	});


	it('should throw RuntimeError for an incorrect key', async () => {
		// --- CORRECT "INCORRECT KEY" (Manual Generation) ---
		const incorrectKey = generateFernetKey();
		expect(incorrectKey).not.toEqual(validKey); // Ensure difference

		await expect(
			decryptFernet({
				input: { data: validToken, key: incorrectKey },
				logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(RuntimeError);

		await expect(
			decryptFernet({
				input: { data: validToken, key: incorrectKey },
				logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(/Error decrypting Fernet token: Invalid Token: HMAC/i);
	});

	// ... (rest of the tests for invalid key format, invalid token format, non-base64 token remain the same) ...
	it('should throw RuntimeError for an invalid key *format*', async () => {
		const invalidFormatKey = 'this-is-not-base64-or-32-bytes';
		await expect(
			decryptFernet({
				input: { data: validToken, key: invalidFormatKey },
				logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(RuntimeError);
		await expect(
			decryptFernet({
				input: { data: validToken, key: invalidFormatKey },
				logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(/Error decrypting Fernet token: Secret must be 32 url-safe base64-encoded bytes./i);
	});


	it('should throw RuntimeError for an invalid token format', async () => {
		const invalidToken = 'this-is-definitely-not-a-fernet-token';
		await expect(
			decryptFernet({
				input: { data: invalidToken, key: validKey },
				logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(RuntimeError);
		await expect(
			decryptFernet({
				input: { data: invalidToken, key: validKey },
				logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(/Error decrypting Fernet token: Invalid version/i);
	});

	it('should throw RuntimeError for a token that is not valid base64', async () => {
		const nonBase64Token = '***invalid base64***';
		await expect(
			decryptFernet({
				input: { data: nonBase64Token, key: validKey },
				logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(RuntimeError);
		await expect(
			decryptFernet({
				input: { data: nonBase64Token, key: validKey },
				logger: mockLogger as any, client: {} as any, ctx: {} as any, type: "decryptFernet", metadata: { setCost: () => 0 },
			})
		).rejects.toThrow(/Error decrypting Fernet token: Invalid version/i);
	});

});
