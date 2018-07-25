import * as user from '../user/index'
import * as _addr from '../util/addr'

export function init() {
	user.getAddr()
		.then((addr) => {
			_addr.setAvailableAddr(addr)
		})
}
