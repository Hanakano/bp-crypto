/* src/actions/index.ts
 * Aggregates available crypto actions for the integration
 */
import { encrypt } from "./encrypt"
import { decrypt } from "./decrypt"
import { decryptFernet } from "./decryptFernet"
import { hashData } from "./hashData"
import { hmac } from "./hmac"
import { verifyHmac } from "./verifyHmac"
import { randomUuid } from "./randomUuid"
import { decodeBase64 } from "./decodeBase64"
import { encodeBase64 } from "./encodeBase64"

export const actionImplementations = {
	encrypt,
	decrypt,
	decryptFernet,
	hashData,
	hmac,
	randomUuid,
	verifyHmac,
	decodeBase64,
	encodeBase64
}
