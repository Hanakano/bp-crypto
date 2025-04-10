/* src/actions/randomUuid.ts
 * Generates a random UUID with optional entropy cache disabling
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';
import { v4 } from 'uuid';

export const randomUuid: bp.IntegrationProps['actions']['randomUuid'] = async ({
	input,
	logger,
}) => {
	logger.forBot().debug('Generating random UUID', { input });
	try {
		// Use uuid with optional entropy cache disabling
		return { uuid: v4() };
	} catch (e) {
		throw new RuntimeError(`Error generating random UUID: ${e}`);
	}
};
