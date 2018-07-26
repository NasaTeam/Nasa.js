import * as util from './index'

// 备用地址池
const AVAILABLE_ADDR_LIST = [
	'n1bCep7RbeCWQk9EQo48V3TuXEdZLCS7eTn',
	'n1Q5ywsbu49mFV4RZSuq3URenNaxiWE4fxe',
	'n1Qj7ynMBW77PCB4Q2EBrfRGQE73PR54VNe',
	'n1YRjbJVRUP9kfpx92wHViJeU4owxLqzReZ',
	'n1ZL7QLfm8UEbUqwEJ9zWBacN1yqk7biM3d',

	'n1TnBAtXn2iUVaaTc5Q3BzwhfhJ9k5GH2Sk',
	'n1GLeUeQKWYQPsm3TQBrpFcJR5CZDkFpZmV',
	'n1ZAhvoHfwQzmVPKYKXUsAVyQTvZSKe5HcX',
	'n1W9FLxZ1UBfRTWMMAAfM7nqUamcAQDk5io',
	'n1bdxUCATAmr1RgffLaj9dNtqSXf5wCtfTk',
]

// 从池子中随机取一个地址来用
function getAvailableAddr() {
	const length = AVAILABLE_ADDR_LIST.length
	const randomIndex = Math.floor(Math.random() * length)
	return AVAILABLE_ADDR_LIST[randomIndex]
}

// 当得到有效地址时，放进池子
function addAvailableAddr(addr) {
	// 池子里只有一个备选地址，说明已经获取到用户自己的地址了，就没必要再往池子里加了
	if (AVAILABLE_ADDR_LIST.length === 1) return
	if (util.isValidAddr(addr) && !AVAILABLE_ADDR_LIST.includes(addr)) {
		// 重复加五次，表示随机选取时权重更高
		for (let i = 0; i < 5; i++) {
			AVAILABLE_ADDR_LIST.push(addr)
		}
	}
}

// 获得用户自己的地址之后，替换预设的地址
function setAvailableAddr(addr) {
	if (util.isValidAddr(addr)) {
		AVAILABLE_ADDR_LIST.length = 0
		AVAILABLE_ADDR_LIST.push(addr)
	}
}

// window.AVAILABLE_ADDR_LIST = AVAILABLE_ADDR_LIST

export {
	getAvailableAddr,
	addAvailableAddr,
	setAvailableAddr,
}
