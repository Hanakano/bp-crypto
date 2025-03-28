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

		// Convert input object to a string for HMAC
		const dataString = JSON.stringify(data);

		// Create HMAC object
		const hmacInstance = crypto.createHmac(algorithm, key);

		// Update HMAC with data and generate hex digest
		const hmacData = hmacInstance.update(dataString, 'utf8').digest('hex');

		return { data: hmacData };
	} catch (e) {
		throw new RuntimeError(`Error creating HMAC: ${e}`);
	}
};
