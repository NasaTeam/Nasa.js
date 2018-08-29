import * as util from './index'

// 备用地址池
const AVAILABLE_ADDR_LIST = [
	'n1bCep7RbeCWQk9EQo48V3TuXEdZLCS7eTn',
	'n1Q5ywsbu49mFV4RZSuq3URenNaxiWE4fxe',
	'n1Qj7ynMBW77PCB4Q2EBrfRGQE73PR54VNe',
	'n1YRjbJVRUP9kfpx92wHViJeU4owxLqzReZ',
	'n1ZL7QLfm8UEbUqwEJ9zWBacN1yqk7biM3d',
]

// 从池子中随机取一个地址来用
function getAvailableAddr() {
	const length = AVAILABLE_ADDR_LIST.length
	const randomIndex = Math.floor(Math.random() * length)
	return AVAILABLE_ADDR_LIST[randomIndex]
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
	setAvailableAddr,
}
