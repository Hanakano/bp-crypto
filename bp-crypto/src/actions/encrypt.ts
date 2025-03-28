/* src/actions/encrypt.ts
 * Creates a Cipher object, with the given algorithm, key and initialization vector (iv)
 * and then uses it to encrypt the data
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';
import crypto from "crypto";

export const encrypt: bp.IntegrationProps['actions']['encrypt'] = async ({
	input,
	logger,
}) => {
	logger.forBot().debug('Creating Cipher with input', { input });

	try {
		const { algorithm, key, data } = input;
		// Base64 decode the key and generate an iv
		const newKey = Buffer.from(key, 'base64');
		const iv = crypto.randomBytes(16);

		const cipher = crypto.createCipheriv(algorithm || "aes-256-cbc", newKey, iv);
		let encrypted = cipher.update(data, "utf8", "base64");
		encrypted += cipher.final("base64");
		// Concatenate IV + Encrypted Data, then encode the whole thing in base64
		const output = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');

		return { output };
	} catch (e) {
		throw new RuntimeError(`Error encrypting data: ${e}`);
	}
};
