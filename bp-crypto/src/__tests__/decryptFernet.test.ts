import { jest } from '@jest/globals';
import { decryptFernet } from '../actions/decryptFernet'; // Adjust path if necessary
import { mockLogger, resetMockLogger } from './mocks/logger'; // Adjust path if necessary
import { RuntimeError } from '@botpress/client';
import fernet from 'fernet'; // Keep the default import for Secret/Token
import crypto from 'crypto'; // Needed for manual key generation

// This test will help identify if the issue is with your code, the key, or the token
// Based on the API docs, we know the key should be: mzCi7ushMrKrAFCyXcl04ZaAHGo1lfBuN_8-0mog8EI=

describe('Fernet Debug Tests', () => {
	// Your current values that are failing
	const providedKey = "mzCi7ushMrKrAFCyXcl04ZaAHGo1lfBuN_8-0mog8EI=";
	const providedToken = "gAAAAABoHGdBhIYY30wlLvBEUHtASDXv--m-YTy4O2lzMnAUlOmuhVVNcFM0gkSjJ1FJiG9kVBSsvL22IL-xf-7URJDMYfgq3tQqZuJeFlgpXsZSb1fXm37aKqmU4cJmg0tTULbNni2mpEb0T0JGREyFU6i4cok-5fimsZnoBM5bQKup1DAO3YuetbRRv3xzA_kNKFmfIr21X9sJJqFoZvV1U_0XqdE9dL6pUBnfXQ3v9H1o8AOylHo=";
	const expectedPlaintext = "This is my secret fernet message";

	// Helper function for URL-safe Base64 encoding
	const generateFernetKey = (): string => {
		const rawKeyBytes = crypto.randomBytes(32);
		return rawKeyBytes.toString('base64')
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=/g, '');
	};

	// Test 1: Verify that we can encrypt and decrypt with a fresh key
	it('should correctly encrypt and decrypt with a fresh key', () => {
		// Generate a fresh key
		const freshKey = generateFernetKey();
		console.log('Fresh key:', freshKey);

		// Create a new Secret with the fresh key
		const secret = new fernet.Secret(freshKey);

		// Create a new token with the secret
		const token = new fernet.Token({ secret });

		// Encrypt the plaintext
		const encrypted = token.encode(expectedPlaintext);
		console.log('Encrypted token:', encrypted);

		// Now decrypt it
		const decryptToken = new fernet.Token({
			secret,
			token: encrypted,
			ttl: 0
		});

		const decrypted = decryptToken.decode().toString();
		console.log('Decrypted text:', decrypted);

		expect(decrypted).toEqual(expectedPlaintext);
	});

	// Test 2: Try to decrypt the provided token with the provided key
	it('should decrypt the provided token with the provided key', () => {
		try {
			const secret = new fernet.Secret(providedKey);
			console.log('Provided key accepted by constructor');

			const token = new fernet.Token({
				secret,
				token: providedToken,
				ttl: 0
			});
			console.log('Token object created successfully');

			const decrypted = token.decode().toString();
			console.log('Successfully decrypted:', decrypted);

			expect(decrypted).toEqual(expectedPlaintext);
		} catch (e) {
			console.error('Error details:', e);
			throw e; // Make the test fail
		}
	});

	// Test 3: Check if the provided key is properly formatted
	it('should validate the key format', () => {
		// Check if key is in valid base64 format
		const keyBuffer = Buffer.from(providedKey, 'base64');
		console.log('Key length in bytes:', keyBuffer.length);
		expect(keyBuffer.length).toBe(32); // Fernet keys should be 32 bytes

		// Try re-encoding to ensure it's valid base64
		const reEncoded = keyBuffer.toString('base64');
		console.log('Original key:', providedKey);
		console.log('Re-encoded key:', reEncoded);

		// Check if the key has URL-safe base64 encoding
		expect(providedKey).not.toContain('+');
		expect(providedKey).not.toContain('/');
	});

	// Test 4: Generate a new token with the provided key and verify decryption
	it('should encrypt and decrypt with the provided key', () => {
		const secret = new fernet.Secret(providedKey);
		const tokenObj = new fernet.Token({ secret });

		// Create a new token with the provided key
		const newToken = tokenObj.encode(expectedPlaintext);
		console.log('New token with provided key:', newToken);

		// Try to decrypt it
		const decryptToken = new fernet.Token({
			secret,
			token: newToken,
			ttl: 0
		});

		const decrypted = decryptToken.decode().toString();
		expect(decrypted).toEqual(expectedPlaintext);
	});

	// Test 5: Check if the provided token is properly formatted
	it('should validate the token format', () => {
		// Check if token starts with the fernet version byte (0x80)
		// Decode the token from base64
		try {
			const tokenBuffer = Buffer.from(providedToken, 'base64');
			console.log('Token first byte (should be 128/0x80):', tokenBuffer[0]);
			console.log('Token length in bytes:', tokenBuffer.length);

			// Fernet tokens should start with version byte 0x80
			expect(tokenBuffer[0]).toBe(128); // 0x80 in decimal
		} catch (e) {
			console.error('Error decoding token from base64:', e);
			throw e;
		}
	});

	// Test 6: Check if there's a padding issue with the key
	it('should try different key formats', () => {
		// The original key
		const originalKey = providedKey;
		console.log('Original key:', originalKey);

		// Try with added padding
		const keyWithPadding = providedKey + '=';
		console.log('Key with extra padding:', keyWithPadding);

		// Try with all padding removed
		const keyNoPadding = providedKey.replace(/=/g, '');
		console.log('Key with no padding:', keyNoPadding);

		// Try with standard base64 encoding instead of URL-safe
		const standardBase64Key = providedKey.replace(/-/g, '+').replace(/_/g, '/');
		console.log('Standard base64 key:', standardBase64Key);

		// Try each key variant
		const variants = [
			{ name: 'Original', key: originalKey },
			{ name: 'With extra padding', key: keyWithPadding },
			{ name: 'No padding', key: keyNoPadding },
			{ name: 'Standard base64', key: standardBase64Key }
		];

		for (const variant of variants) {
			try {
				console.log(`\nTrying ${variant.name} key format`);
				const secret = new fernet.Secret(variant.key);
				console.log(`✓ Created secret with ${variant.name} key`);

				const token = new fernet.Token({
					secret,
					token: providedToken,
					ttl: 0
				});
				console.log(`✓ Created token object with ${variant.name} key`);

				try {
					const decrypted = token.decode().toString();
					console.log(`✓ Successfully decrypted with ${variant.name} key:`, decrypted);
				} catch (e) {
					console.log(`✗ Failed to decrypt with ${variant.name} key:`, e);
				}
			} catch (e) {
				console.log(`✗ Failed to create secret with ${variant.name} key:`, e);
			}
		}
	});

	// Test 7: Try creating and decrypting a token manually to verify steps
	it('should manually verify the fernet process', () => {
		// Generate a new key for testing
		const testKey = generateFernetKey();
		console.log('Test key:', testKey);

		// Create a secret
		const secret = new fernet.Secret(testKey);

		// Create a test message
		const testMessage = "Test message for manual verification";

		// Encode a token
		const token = new fernet.Token({ secret });
		const encodedToken = token.encode(testMessage);
		console.log('Encoded token:', encodedToken);

		// Decode it using your decryptFernet function logic
		const manualDecrypt = (token: string, key: string) => {
			try {
				const secret = new fernet.Secret(key);
				const tokenObj = new fernet.Token({
					secret,
					token: token,
					ttl: 0
				});
				return tokenObj.decode().toString();
			} catch (e) {
				return `Error: ${e}`;
			}
		};

		const decrypted = manualDecrypt(encodedToken, testKey);
		console.log('Manual decrypt result:', decrypted);
		expect(decrypted).toEqual(testMessage);

		// Now try the provided token and key
		const providedDecrypted = manualDecrypt(providedToken, providedKey);
		console.log('Manual decrypt with provided values:', providedDecrypted);
	});

	// Test 8: Try raw token to see if there are encoding issues
	it('should check for token encoding issues', () => {
		// Try to normalize the token by re-encoding it
		try {
			const decodedTokenBuffer = Buffer.from(providedToken, 'base64');
			const reEncodedToken = decodedTokenBuffer.toString('base64');
			console.log('Original token:', providedToken);
			console.log('Re-encoded token:', reEncodedToken);

			if (providedToken !== reEncodedToken) {
				console.log('Tokens differ after re-encoding, which suggests encoding issues');

				// Try to decrypt with the re-encoded token
				const secret = new fernet.Secret(providedKey);
				const token = new fernet.Token({
					secret,
					token: reEncodedToken,
					ttl: 0
				});

				try {
					const decrypted = token.decode().toString();
					console.log('Successfully decrypted with re-encoded token:', decrypted);
				} catch (e) {
					console.log('Failed to decrypt with re-encoded token:', e);
				}
			}
		} catch (e) {
			console.error('Error re-encoding token:', e);
		}
	});
});
