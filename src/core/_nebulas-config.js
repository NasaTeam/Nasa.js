/* global NebPay */
import * as env from '../env/index'

const nebConfig = NebPay.config

const NEBULAS_CONFIG = {
	[env.LOCAL]: {
		chainId: 100,
		endpoint: 'http://localhost:8685/',
		apiPayId: nebConfig.testnetUrl,
	},
	[env.TEST]: {
		chainId: 1001,
		endpoint: 'https://testnet.nebulas.io/',
		apiPayId: nebConfig.testnetUrl,
	},
	[env.MAIN]: {
		chainId: 1,
		endpoint: 'https://mainnet.nebulas.io/',
		apiPayId: nebConfig.mainnetUrl,
	},
}

function getNebulasConfig(key) {
	const currentEnv = env.get()
	return NEBULAS_CONFIG[currentEnv][key] || ''
}

function getNebPayOptions() {
	const options = {}
	options.callback = getNebulasConfig('apiPayId')
	return options
}

export {
	NEBULAS_CONFIG,
	getNebulasConfig,
	getNebPayOptions,
}
