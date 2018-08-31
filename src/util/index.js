function isValidAddr(str) {
	return /^n\d[0-9a-zA-Z]{33}$/.test(str)
}
function isValidTxHash(str) {
	return /^[0-9a-zA-Z]{64}$/.test(str)
}
function isValidPayId(str) {
	return /^[0-9a-zA-Z]{32}$/.test(str)
}

export {
	isValidAddr,
	isValidTxHash,
	isValidPayId,
}
export { ready } from './ready'
