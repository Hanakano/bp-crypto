/* src/actions/btoa.ts
 * Base64 Encodes a string
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';

export const btoa: bp.IntegrationProps['actions']['btoa'] = async ({
	input,
	logger,
}) => {
	logger.forBot().debug('Encoding to base64:', { input });

	try {
		const { data } = input;
		// Ensure the data is a string then encode it
		const json = JSON.stringify(data);
		const encoded = Buffer.from(json).toString('base64');
		return { output: encoded };
	} catch (e) {
		throw new RuntimeError(`Error b64 encoding data: ${e}`);
	}
};
