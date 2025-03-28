/* src/actions/hashData.ts
 * Creates a hash of the input data using the specified crypto algorithm
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';
import crypto from "crypto";

export const hashData: bp.IntegrationProps['actions']['hashData'] = async ({
	input,
	logger,
}) => {
	logger.forBot().debug('Hashing data with input', { input });
	try {
		const { data, algorithm = 'sha256' } = input;

		// Convert input object to a string for hashing
		const dataString = JSON.stringify(data);

		// Create hash object
		const hash = crypto.createHash(algorithm);

		// Update hash with data and generate hex digest
		const hashedData = hash.update(dataString, 'utf8').digest('hex');

		return { data: hashedData };
	} catch (e) {
		throw new RuntimeError(`Error hashing data: ${e}`);
	}
};
