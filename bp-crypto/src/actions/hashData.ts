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
		if (!data) {
			logger.warn('data is a blank or falsy parameter. Returning empty string!');
			return { output: "" }
		}
		// Update hash with data and generate hex digest
		return { output: crypto.createHash(algorithm).update(data, 'utf8').digest('hex') };
	} catch (e) {
		throw new RuntimeError(`Error hashing data: ${e}`);
	}
};
