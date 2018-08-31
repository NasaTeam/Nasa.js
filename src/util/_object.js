// 暂时没实现第三个参数 context，等要用到再说
export function each(obj, callback) {
	if (typeof callback !== 'function') return
	if (obj && typeof obj === 'object') {
		const keys = Object.keys(obj)
		keys.forEach(function (key) {
			const value = obj[key]
			callback(value, key)
		})
	} else if (Array.isArray(obj)) {
		obj.forEach(callback)
	}
}
