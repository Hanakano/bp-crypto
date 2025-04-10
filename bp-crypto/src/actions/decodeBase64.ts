/* src/actions/decodeBase64.ts
 * Decodes a Base64-encoded JSON string
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';

export const decodeBase64: bp.IntegrationProps['actions']['decodeBase64'] = async ({
	input,
	logger,
}) => {
	logger.forBot().debug('Decoding from base64:', { input });

	try {
		const { data } = input;
		const decodedStr = Buffer.from(data, 'base64').toString('utf-8');
		const parsed = JSON.parse(decodedStr);
		return parsed;
	} catch (e) {
		throw new RuntimeError(`Error base64 decoding data: ${e}`);
	}
};
