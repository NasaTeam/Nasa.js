import * as user from '../user/index'
import * as _addr from '../util/addr'

export function init() {
	document.addEventListener('DOMContentLoaded', () => {
		user.getAddr()
			.then((addr) => {
				_addr.setAvailableAddr(addr)
			})
	}, false)
}
