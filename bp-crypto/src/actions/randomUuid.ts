/* src/actions/randomUuid.ts
 * Generates a random UUID with optional entropy cache disabling
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';
import crypto from "crypto";

export const randomUuid: bp.IntegrationProps['actions']['randomUuid'] = async ({
	input,
	logger,
}) => {
	logger.forBot().debug('Generating random UUID', { input });
	try {
		// Use Node.js crypto.randomUUID with optional entropy cache disabling
		const uuid = crypto.randomUUID(input?.options);

		return { uuid };
	} catch (e) {
		throw new RuntimeError(`Error generating random UUID: ${e}`);
	}
};
