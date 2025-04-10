/* src/actions/hmac.ts
 * Creates an HMAC of the input data using the specified crypto algorithm and key
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';
import crypto from "crypto";

export const hmac: bp.IntegrationProps['actions']['hmac'] = async ({
	input,
	logger,
}) => {
	logger.forBot().debug('Creating HMAC with input', { input });
	try {
		const { data, algorithm = 'sha256', key } = input;
		if (!data || !key) {
			logger.warn("data or key is a blank or falsy parameter. Returning empty string!");
			return { output: "" }
		}

		// Create HMAC object
		const hmacInstance = crypto.createHmac(algorithm, key);

		// Update HMAC with data and generate hex digest
		const hmacData = hmacInstance.update(data, 'utf8').digest('hex');

		return { output: hmacData };
	} catch (e) {
		throw new RuntimeError(`Error creating HMAC: ${e}`);
	}
};
