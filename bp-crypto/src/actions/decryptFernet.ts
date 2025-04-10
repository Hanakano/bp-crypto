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

		logger.debug(`[${actionLabel}] Attempting to decrypt Fernet token.`);

		// Create a new Secret with the provided key
		// The constructor itself might throw if the key format is invalid
		const secret = new fernet.Secret(key);

		// Create a Token from the data
		const token = new fernet.Token({
			secret,
			token: data,
			ttl: 0 // Skip time-based expiration check
		});

		// Decode the token to get the plaintext
		// decode() throws on signature mismatch or other token errors
		const decodedBuffer = token.decode();
		const decodedString = decodedBuffer.toString();

		logger.debug(`[${actionLabel}] Successfully decrypted Fernet token.`, {
			dataLength: data.length,
			outputLength: decodedString.length
		});

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
