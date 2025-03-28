/* integration.definition.ts
 * Config file/entrypoint for the integration
 * bplint-disable */
import { IntegrationDefinition } from '@botpress/sdk'
import { actionDefinitions } from 'src/definitions/actions'

export default new IntegrationDefinition({
	name: 'crypto',
	description: 'Exposes actions from the Nodejs standard crypto library',
	version: '0.0.4',
	readme: 'hub.md',
	icon: 'icon.svg',
	actions: actionDefinitions,
	secrets: {},
})
