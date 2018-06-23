function supportFetch() {
	return typeof window.fetch === 'function'
}
function supportStringIncludes() {
	return typeof String.prototype.includes === 'function'
}
function supportArrayIncludes() {
	return typeof Array.prototype.includes === 'function'
}

export {
	supportFetch,
	supportStringIncludes,
	supportArrayIncludes,
}
