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
	description: "Encrypts a string using AES-256",
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
	description: "Decrypts an AES-256 encrypted string",
	input: {
		schema: z.object({
			data: z.string().describe("String data to decrypt").title("Data"),
			algorithm: AlgorithmTypes.describe("which algorithm to use").default("aes-256-cbc").title("Algorithm"),
			ivLength: z.number().default(16).describe("How long the IV prefix on data is").title("IV Length"),
			key: z.string().describe("The encryption key").title("Key"),
		}),
	},
	output: {
		schema: z.object({
			output: z.string().describe("The decrypted data, ready to be parsed as needed").title("Output")
		}),
	},
}

const decryptFernet = {
	title: 'decryptFernet',
	description: "Decrypts an AES-256 encrypted string using Fernet spec",
	input: {
		schema: z.object({
			data: z.string().describe("String data to decrypt").title("Data"),
			key: z.string().describe("The encryption key").title("Key"),
		}),
	},
	output: {
		schema: z.object({
			output: z.string().describe("The decrypted data, ready to be parsed as needed").title("Output")
		}),
	},
}
const hashData = {
	title: 'hash',
	description: "Hashes data using aes-256 or sha-256 algorithms",
	input: {
		schema: z.object({
			data: z.string().describe("Stringified data to hash").title("Data"),
			algorithm: z.string().default("aes-256").describe("Which OpenSSL algorithm to use when creating the hash").title("Algorithm"),
		}),
	},
	output: {
		schema: z.object({
			output: z.string().describe("The computed hash").title("Output")
		}),
	},
}

const hmac = {
	title: 'hmac',
	description: "Creates an encrypted HMAC signature",
	input: {
		schema: z.object({
			data: z.string().describe("Stringified HMAC data").title("Data"),
			algorithm: z.string().default("aes-256").describe("Which OpenSSL algorithm to use when creating the hash").title("Algorithm"),
			key: z.string().describe("The encryption key").title("Key"),
			encoding: z.string().default("hex").describe("Text encoding method for the HMAC signature"),
		}),
	},
	output: {
		schema: z.object({
			output: z.string().describe("The computed hmac string").title("Output")
		}),
	},
}

const verifyHmac = {
	title: 'verifyHmac',
	description: "Verifies an HMAC signature against a known cipher",
	input: {
		schema: z.object({
			algorithm: z.string().describe("Hash algorithm to use for HMAC verification (e.g., 'sha256')").title("Algorithm"),
			key: z.string().describe("The secret key used to generate the HMAC").title("Key"),
			data: z.string().describe("The original data").title("Data"),
			expectedHmac: z.string().describe("The expected HMAC value").title("Expected HMAC"),
			inputEncoding: z.string().default("hex").describe("Text encoding method for the incoming HMAC signature"),
			outputEncoding: z.string().default("utf8").describe("Text encoding method for the expected HMAC signature"),
		}),
	},
	output: {
		schema: z.object({
			valid: z.boolean().describe("Returns true if the computed HMAC matches the expected HMAC").title("Valid")
		}),
	},
}

const randomUuid = {
	title: 'randomUuid',
	description: "Generates a random uuid",
	input: { schema: z.object({}) },
	output: {
		schema: z.object({
			uuid: z.string().describe("The generated UUID").title("Uuid"),
		}),
	},
}
const decodeBase64 = {
	title: 'decodeBase64',
	description: "Decodes a base64 string",
	input: {
		schema: z.object({
			data: z.string().describe("A base64-encoded string").title("Data"),
		}),
	},
	output: {
		schema: z.object({
			output: z.string().describe("The decoded string").title("Output"),
		}),
	},
}
const encodeBase64 = {
	title: 'encodeBase64',
	description: "Encodes data into a base64 string",
	input: {
		schema: z.object({
			data: z.union([
				z.boolean(),
				z.string(),
				z.record(z.any()),
				z.array(z.any()),
			]).describe("The data to base64 encode").title("Data")
		}),
	},
	output: {
		schema: z.object({
			output: z.string().describe("The base64 encoded string").title("Output"),
		}),
	},
}

const verifyAiPriseHmac = {
	title: "VerifyAiPriseHMAC",
	description: "Verifies the HMAC header on incoming AIPrise event callbacks.",
	input: {
		schema: z.object({
			apiPrivateKey: z.string().describe("Your AIPrise private key").title("Private Key"),
			payload: z.string().describe("The event payload (string or object)").title("Payload"),
			xHmacSignature: z.string().describe("The incoming event's HMAC header").title("xHmacSignature")
		})
	},
	output: {
		schema: z.object({
			valid: z.boolean().describe("Whether or not the callback passes the validation process").title("Valid")
		})
	},
}

export const actionDefinitions = {
	encrypt,
	decrypt,
	decryptFernet,
	hashData,
	hmac,
	randomUuid,
	verifyHmac,
	verifyAiPriseHmac,
	decodeBase64,
	encodeBase64
}
