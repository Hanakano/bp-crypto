/* src/actions/verifyHmac.ts
 * Verifies an HMAC by comparing the computed HMAC with the expected HMAC
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';
import crypto from "crypto";

export const verifyHmac: bp.IntegrationProps['actions']['verifyHmac'] = async ({
	input,
	logger,
}) => {
	logger.forBot().debug('Verifying HMAC with input', { input });
	try {
		const { algorithm, key, data, expectedHmac, encoding } = input;
		for (const [name, value] of
			[['data', data], ['key', key], ['algorithm', algorithm], ['expectedHmac', expectedHmac]]
		) {
			if (!value) {
				logger.warn(`${name} is a blank or falsy parameter. Returning empty string!`);
				return { valid: false }
			}
		}

		// Create HMAC object
		const hmacInstance = crypto.createHmac(algorithm, key);

		// Compute HMAC of the data
		const computedHmac = hmacInstance.update(data, inputEncoding).digest(outputEncoding);

		// Compare computed HMAC with expected HMAC
		const valid = computedHmac === expectedHmac;

		return { valid };
	} catch (e) {
		throw new RuntimeError(`Error verifying HMAC: ${e}`);
	}
};
