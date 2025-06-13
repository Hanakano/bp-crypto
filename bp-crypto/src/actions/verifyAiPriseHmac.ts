/* src/actions/verifyAiPriseHmac.ts
 * Verifies an AI Prise event callback by looking at the header and computing a matching keyed hash
 * https://docs.aiprise.com/docs/callbacks-authentication
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';
import crypto from "crypto";

export const verifyAiPriseHmac: bp.IntegrationProps['actions']['verifyAiPriseHmac'] = async ({
	input,
	logger,
}) => {
	logger.forBot().debug('Verifying AiPrise HMAC signature', { input });
	try {
		const { apiPrivateKey, payload, xHmacSignature } = input;

		// Validate required inputs
		if (!payload || !apiPrivateKey || !xHmacSignature) {
			logger.warn('Missing required parameters for HMAC verification');
			return { valid: false, error: 'Missing required parameters' };
		}

		// Create HMAC object with SHA256 algorithm and the API private key
		const hmacInstance = crypto.createHmac('sha256', apiPrivateKey);

		// Compute HMAC of the payload
		const computedHmac = hmacInstance.update(Buffer.from(payload, 'utf8')).digest('hex').toLowerCase();

		// Compare computed HMAC with the X-HMAC-SIGNATURE header (case insensitive)
		const valid = computedHmac.toLowerCase() === xHmacSignature.toLowerCase();

		logger.forBot().debug('HMAC verification result', {
			valid,
			computedHmac,
			receivedHmac: xHmacSignature
		});

		return { valid, computedHmac };
	} catch (e) {
		logger.forBot().error('Error verifying AiPrise HMAC', { error: e });
		throw new RuntimeError(`Error verifying AiPrise HMAC: ${e}`);
	}
};
