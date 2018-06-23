export const MAIN = 'mainnet'
export const TEST = 'testnet'
export const LOCAL = 'local'
export const MAINNET = MAIN
export const TESTNET = TEST

let _currentEnv = MAIN

function set(envName = '') {
	envName = String(envName)
	if ([MAIN, TEST, LOCAL].indexOf(envName) !== -1) {
		_currentEnv = envName
	} else {
		console.error('[Nasa.js] Wrong env name!')
	}
}

function get() {
	return _currentEnv
}

export {
	set,
	get,
}
