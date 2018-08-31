import * as ua from '../ua/index'

function isDomReady() {
	return document.readyState === 'interactive' || document.readyState === 'complete'
}

// 逐个执行并清空队列中的任务
const queue = []
function handleQueue() {
	while (queue.length) {
		const task = queue.shift()
		try {
			task()
		} catch (e) {
			console.error(e)
		}
	}
}

// 此 Promise 包含的值表示 "钱包扩展是否可用" 这个问题的答案
function getPromise() {
	return new Promise((resolve, reject) => {
		/** DEBUG_INFO_START **/
		console.log('[Nasa.js] `.ready()` init promise.')
		/** DEBUG_INFO_END **/

		// 如果当前浏览器不可能支持钱包扩展，则答案确定 - 否
		if (!ua.isDesktopChrome()) resolve(false)

		// 如果钱包扩展已就绪，则答案确定 - 是
		else if (ua.isWalletExtensionInstalled()) resolve(true)

		// 如果到这里还没有得到答案，则尝试轮询
		// 如果 DOM 已经 ready，则只给最后一次重试机会
		else setTimeout(recheck, 100, isDomReady())

		function recheck(isLastCheck) {
			/** DEBUG_INFO_START **/
			console.log('[Nasa.js] `.ready()` recheck, isLastCheck: ', isLastCheck)
			/** DEBUG_INFO_END **/

			// 如果钱包扩展已就绪，则答案确定 - 是
			if (ua.isWalletExtensionInstalled()) resolve(true)

			// 如果最后一次轮询机会还没有得出结论，则答案确定 - 否
			else if (isLastCheck) resolve(false)

			// 继续重试
			else setTimeout(recheck, 100, isDomReady())
		}
	})
}

let promise
export function ready(fn) {
	if (typeof fn !== 'function') return
	queue.push(fn)

	if (!promise) promise = getPromise()
	promise.then((value) => {
		/** DEBUG_INFO_START **/
		console.log('[Nasa.js] `.ready()` promise value: ', value)
		/** DEBUG_INFO_END **/
		handleQueue()
	})
}
