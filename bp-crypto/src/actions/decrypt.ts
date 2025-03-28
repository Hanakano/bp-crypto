/* src/actions/decrypt.ts
 * Creates a Decipher object, with the given algorithm, key and initialization vector (iv)
 * and then uses it to decrypt the data
 */
import * as bp from '.botpress';
import { RuntimeError } from '@botpress/client';
import crypto from "crypto";

export const decrypt: bp.IntegrationProps['actions']['decrypt'] = async ({ input, logger }) => {
	logger.forBot().debug('Creating Decipher with input', { input });
	try {
		const { algorithm, key, ivLength, data } = input;

		// First, decrypt the base64 encoded data and key to buffers
		const encryptedBuffer = Buffer.from(data, "base64")
		const encryptedKey = Buffer.from(key, "base64")

		// Separate IV from the text
		const iv = encryptedBuffer.subarray(0, ivLength);
		const encryptedText = encryptedBuffer.subarray(ivLength);

		// Create a decipher instance
		const decipher = crypto.createDecipheriv(algorithm || "aes-256-cbc", encryptedKey, iv)
		let output = decipher.update(encryptedText)
		output = Buffer.concat([output, decipher.final()]);
		return { output: output.toString("utf-8") };
	} catch (e) {
		throw new RuntimeError(`Error decrypting data: ${e}`);
	}
};
