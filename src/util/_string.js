export function stripErrorMsgPrefix(str) {
	str = String(str)
	// 'Call:' 出现在 'Error:' 之前，所以下面的顺序不能随意修改
	return str
		.replace(/^call:/i, '')
		.trim()
		.replace(/^error:/i, '')
		.trim()
}
