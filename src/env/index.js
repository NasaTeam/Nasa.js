export const MAIN = 'mainnet'
export const TEST = 'testnet'
export const LOCAL = 'local'
export const MAINNET = MAIN
export const TESTNET = TEST

let _currentEnv = MAIN

function set(envName) {
	envName = String(envName)
	if ([
		MAIN,
		TEST,
		LOCAL,
	].includes(envName)) {
		_currentEnv = envName
	} else {
		console.error('[Nasa.js] wrong env name!')
	}
}

function get() {
	return _currentEnv
}

export {
	set,
	get,
}
