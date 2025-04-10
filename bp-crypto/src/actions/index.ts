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
import { atob } from "./atob"
import { btoa } from "./btoa"

export const actionImplementations = {
	encrypt,
	decrypt,
	decryptFernet,
	hashData,
	hmac,
	randomUuid,
	verifyHmac,
	atob,
	btoa
}
