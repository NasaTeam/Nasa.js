function supportFetch() {
	return typeof window.fetch === 'function'
}
function supportStringIncludes() {
	return typeof String.prototype.includes === 'function'
}

export {
	supportFetch,
	supportStringIncludes,
}
