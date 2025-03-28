/* src/actions/index.ts
 * Aggregates available crypto actions for the integration
 */
import { encrypt } from "./encrypt"
import { decrypt } from "./decrypt"
import { hashData } from "./hashData"
import { hmac } from "./hmac"
import { verifyHmac } from "./verifyHmac"
import { randomUuid } from "./randomUuid"

export const actionImplementations = {
	encrypt,
	decrypt,
	hashData,
	hmac,
	randomUuid,
	verifyHmac
}
