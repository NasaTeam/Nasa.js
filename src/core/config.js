import { NebPay } from '../external-dependency'
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

function getDefaultOptions() {
	const options = {}
	const currentEnv = env.get()
	options.callback = NEBULAS[currentEnv].apiPayId
	return options
}

export {
	getDefaultOptions,
}
