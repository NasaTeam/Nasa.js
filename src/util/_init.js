import * as user from '../user/index'
import * as _addr from '../util/_addr'

export function init() {
	document.addEventListener('DOMContentLoaded', () => {
		// 延后 200ms 是为了避免在 ready() 之前执行
		setTimeout(() => {
			user.getAddr()
				.then((addr) => {
					// console.log(addr)
					_addr.setAvailableAddr(addr)
				}, () => {
					// console.log('fail')
				})
		}, 200)
	})
}

