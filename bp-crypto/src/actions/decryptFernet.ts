/* src/actions/decryptFernet.ts
 * Special decryption for fernet tokens
 * learn more at https://github.com/kr/fernet-spec
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';
import fernet from 'fernet';

export const decryptFernet: bp.IntegrationProps['actions']['decryptFernet'] = async ({ input, logger }) => {
	const actionLabel = 'decryptFernet'; // For consistent logging
	logger = logger.forBot(); // Simplify logger usage
	try {
		const { key, data } = input;
		// Input validation
		if (!key) {
			logger.warn(`[${actionLabel}] Key is a blank or falsy parameter. Returning empty string!`);
			return { output: "" }
		}
		if (!data) {
			logger.warn(`[${actionLabel}] Data is a blank or falsy parameter. Returning empty string!`);
			return { output: "" }
		}

		logger.debug(`[${actionLabel}] Attempting to decrypt Fernet token.`, {
			keyLength: key.length,
			dataLength: data.length
		});

		// Try multiple key formats to handle potential encoding issues
		const keyVariants = [
			key,                                        // Original key
			key.replace(/-/g, '+').replace(/_/g, '/'),  // URL-safe to standard base64
			key + '=',                                  // Add padding
			key.replace(/=/g, '')                       // Remove padding
		];

		let decodedString = '';
		let success = false;
		let lastError: Error | null = null;

		// Try each key variant
		for (const keyVariant of keyVariants) {
			try {
				// Create a new Secret with the provided key
				const secret = new fernet.Secret(keyVariant);

				// Create a Token from the data
				const token = new fernet.Token({
					secret,
					token: data,
					ttl: 0 // Skip time-based expiration check
				});

				// Decode the token to get the plaintext
				const decodedBuffer = token.decode();
				decodedString = decodedBuffer.toString();

				// If we got here, decryption was successful
				success = true;
				logger.debug(`[${actionLabel}] Successfully decrypted Fernet token with key variant.`, {
					keyVariant: keyVariant === key ? 'original' : 'modified',
					outputLength: decodedString.length
				});
				break;
			} catch (e) {
				lastError = e instanceof Error ? e : new Error(String(e));
				// Continue to the next variant
			}
		}

		if (!success && lastError) {
			// If none of the variants worked, throw the last error
			throw lastError;
		}

		return { output: decodedString };
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		logger.error(`[${actionLabel}] Error decrypting Fernet token: ${errorMessage}`, {
			// Include stack trace for better debugging if available
			stack: e instanceof Error ? e.stack : undefined,
		});
		// Re-throw as RuntimeError, including the original error message
		throw new RuntimeError(`Error decrypting Fernet token: ${errorMessage}`);
	}
};
