/* src/definitions/actions.ts
 * Declarations of available actions for this integration
 * This is the data that gets shown in the Botpress studio
 */
import { z } from '@botpress/sdk'

const AlgorithmTypes = z.enum([
	"aes-256-cbc", "aes-256-ecb"
])

const encrypt = {
	title: 'encrypt',
	input: {
		schema: z.object({
			data: z.string().describe("Stringified data to encrypt").title("Data"),
			algorithm: AlgorithmTypes.describe("which algorithm to use").default("aes-256-cbc").title("Algorithm"),
			key: z.string().describe("The encryption key").title("Key"),
		}),
	},
	output: {
		schema: z.object({
			output: z.string().describe("The data, encrypted using the supplied algorithm, key, and iv").title("Output"),
		}),
	},
}

const decrypt = {
	title: 'decrypt',
	input: {
		schema: z.object({
			data: z.string().describe("String data to decrypt").title("Data"),
			algorithm: AlgorithmTypes.describe("which algorithm to use").default("aes-256-cbc").title("Algorithm"),
			ivLength: z.number().default(16).describe("How long the IV prefix on data is"),
			key: z.string().describe("The encryption key").title("Key"),
		}),
	},
	output: {
		schema: z.object({
			output: z.string().describe("The decrypted data, ready to be parsed as needed")
		}),
	},
}

const hashData = {
	title: 'hash',
	input: {
		schema: z.object({
			data: z.object({}),
			algorithm: z.string().default("aes-256").describe("Which OpenSSL algorithm to use when creating the hash"),
		}),
	},
	output: {
		schema: z.object({
			data: z.string().describe("The computed hash")
		}),
	},
}

const hmac = {
	title: 'hmac',
	input: {
		schema: z.object({
			data: z.object({}),
			algorithm: z.string().default("aes-256").describe("Which OpenSSL algorithm to use when creating the hash"),
			key: z.string().describe("The encryption key"),
		}),
	},
	output: {
		schema: z.object({
			data: z.string().describe("The computed hmac string")
		}),
	},
}

const verifyHmac = {
	title: 'verifyHmac',
	input: {
		schema: z.object({
			algorithm: z.string().describe("Hash algorithm to use for HMAC verification (e.g., 'sha256')"),
			key: z.string().describe("The secret key used to generate the HMAC"),
			data: z.string().describe("The original data"),
			expectedHmac: z.string().describe("The expected HMAC value"),
		}),
	},
	output: {
		schema: z.object({
			valid: z.boolean().describe("Returns true if the computed HMAC matches the expected HMAC")
		}),
	},
}

const randomUuid = {
	title: 'randomUuid',
	input: {
		schema: z.object({
			options: z.object({ disableEntropyCache: z.boolean().optional() }).optional().describe("UUID generation options"),
		}),
	},
	output: {
		schema: z.object({
			uuid: z.string().describe("The generated UUID"),
		}),
	},
}

export const actionDefinitions = {
	encrypt,
	decrypt,
	hashData,
	hmac,
	randomUuid,
	verifyHmac
}
