function isValidAddr(str) {
	return /^n\d\w{33}$/.test(str)
}
function isValidTxHash(str) {
	return /^\w{64}$/.test(str)
}
function isValidPayId(str) {
	return /^\w{32}$/.test(str)
}

export {
	isValidAddr,
	isValidTxHash,
	isValidPayId,
}
export { ready } from './ready'
