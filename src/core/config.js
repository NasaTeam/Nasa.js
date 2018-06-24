/* global NebPay */
import * as env from '../env/index'

const DEFAULT_ADDR = 'n1bCep7RbeCWQk9EQo48V3TuXEdZLCS7eTn'

const NEBULAS = {
	[env.TEST]: {
		apiBaseUrl: 'https://testnet.nebulas.io/v1/',
		chainId: 1001,
	},
	[env.MAIN]: {
		apiBaseUrl: 'https://mainnet.nebulas.io/v1/',
		chainId: 1,
	},
	[env.LOCAL]: {
		apiBaseUrl: 'http://localhost:8685/v1/',
		chainId: 100,
	},
}

function getDefaultOptions() {
	const result = {}
	if (env.get() === env.TEST) result.callback = NebPay.config.testnetUrl
	return result
}

export {
	getDefaultOptions,
}
