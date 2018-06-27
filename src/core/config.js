/* global NebPay */
import * as env from '../env/index'

const DEFAULT_ADDR = 'n1bCep7RbeCWQk9EQo48V3TuXEdZLCS7eTn'

const nebConfig = NebPay.config

const NEBULAS = {
	[env.LOCAL]: {
		chainId: 100,
		apiBaseUrl: 'http://localhost:8685/v1/',
		apiPayId: nebConfig.testnetUrl,
	},
	[env.TEST]: {
		chainId: 1001,
		apiBaseUrl: 'https://testnet.nebulas.io/v1/',
		apiPayId: nebConfig.testnetUrl,
	},
	[env.MAIN]: {
		chainId: 1,
		apiBaseUrl: 'https://mainnet.nebulas.io/v1/',
		apiPayId: nebConfig.mainnetUrl,
	},
}

function get(key) {
	const currentEnv = env.get()
	return NEBULAS[currentEnv][key] || ''
}

function getNebPayOptions() {
	const options = {}
	options.callback = get('apiPayId')
	return options
}

export {
	DEFAULT_ADDR,
	getNebPayOptions,
	get,
}
