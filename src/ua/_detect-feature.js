function supportFetch() {
	return typeof window.fetch === 'function'
}
function supportStringProtoIncludes() {
	return typeof String.prototype.includes === 'function'
}
function supportArrayProtoIncludes() {
	return typeof Array.prototype.includes === 'function'
}
function supportObjectAssign() {
	return typeof Object.assign === 'function'
}

// TODO Promise
// TODO ArrayIsArray

export {
	supportFetch,
	supportStringProtoIncludes,
	supportArrayProtoIncludes,
	supportObjectAssign,
}
