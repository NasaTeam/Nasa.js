import { isDesktopChrome, isWalletExtensionInstalled } from '../ua'
import * as error from '../const/error'
import { isValidAddr } from '../util'

function getAddr() {
	// 环境检测 & 快速失败
	if (!isDesktopChrome() || !isWalletExtensionInstalled()) {
		return Promise.reject(new Error(error.EXTENSION_NOT_INSTALLED))
	}

	// 每次都要向钱包扩展问一下，因为用户可能会切换钱包
	window.postMessage({
		'target': 'contentscript',
		'data': {},
		'method': 'getAccount',
	}, '*')
	return new Promise((resolve, reject) => {
		const handler = (ev) => {
			// 各种库和扩展产生的消息有很多，只需要挑出我们关注的数据再返回
			// get `ev.data.data`
			const data = (ev.data || {}).data || {}
			let account = data.account || ''
			account = String(account)
			if (account && isValidAddr(account)) {
				window.removeEventListener('message', handler, false)
				resolve(account)
			}
		}
		window.addEventListener('message', handler, false)

		// 如果钱包扩展没有导入钱包，或者扩展已经不再支持 `getAccount` 接口，会进入这里
		setTimeout(() => {
			reject(new Error(error.EXTENSION_TIMEOUT))
		}, 300)
	})
}

export {
	getAddr,
}
