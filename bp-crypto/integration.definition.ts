/* integration.definition.ts
 * Config file/entrypoint for the integration
 * bplint-disable */
import { IntegrationDefinition } from '@botpress/sdk'
import { actionDefinitions } from 'src/definitions/actions'

export default new IntegrationDefinition({
	name: 'crypto',
	title: 'crypto',
	description: 'Cryptographic actions like encrypting, decrypting, and hashing from NodeJS libraries',
	version: '0.0.7',
	readme: 'hub.md',
	icon: 'icon.svg',
	actions: actionDefinitions,
	secrets: {},
})
