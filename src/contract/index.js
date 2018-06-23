import * as env from '../env/index'
import { isValidAddr } from '../util/index'

let _store = {}
const DEFAULT = 'default'

function set(config) {
	if (typeof config !== 'object') {
		console.error('[Nasa.js] Wrong param!')
	} else {
		const contractNames = Object.keys(config)
		console.log(contractNames)
		if (contractNames.indexOf(DEFAULT) === -1 && !_store[DEFAULT]) {
			console.error('[Nasa.js] Missing default contract!')
		}

		contractNames.forEach((name) => {
			const contractItem = config[name]
			const item = _store[name] = _store[name] || {}
			void [env.MAIN, env.TEST, env.LOCAL].forEach((envName) => {
				const contractAddr = (contractItem[envName] || '').trim()
				if (isValidAddr(contractAddr)) {
					item[envName] = contractAddr
				} else {
					console.error(`[Nasa.js] ${name}.${envName}(${contractAddr}) is not valid!`)
				}
			})
		})
	}
}

function get(contractName = '') {
	const currentEnv = env.get()
	const contractItem = _store[contractName || DEFAULT] || {}
	const contract = contractItem[currentEnv] || ''
	return contract
}

export {
	set,
	get,
}
