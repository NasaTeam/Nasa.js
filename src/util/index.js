function isValidAddr(str) {
	return /^n\d\w{33}$/.test(str)
}
function isValidTxHash(str) {
	return /^\w{64}$/.test(str)
}
function isValidPayId(str) {
	return /^\w{32}$/.test(str)
}

function stripErrorMsgPrefix(str) {
	str = String(str)
	return str
		.replace(/^call:/i, '')
		.trim()
		.replace(/^error:/i, '')
		.trim()
}

export {
	isValidAddr,
	isValidTxHash,
	isValidPayId,
	stripErrorMsgPrefix,
}
