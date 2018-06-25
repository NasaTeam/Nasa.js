/* global nebPay */
import { nebPay } from '../external-dependency'
import * as config from './config'
import { isValidPayId } from '../util'
import * as error from '../const/error'

/*
当交易查询成功时，nebPay.queryPayInfo() 的返回值是一个 JSON 字符串，格式为： {
	"code": 0,
	"data": {},  // tx data
	"msg": "success",
}
各种错误情况： {
	"code": 1,
	"data": {},
	// 交易查询失败
    "msg": "payId ZBTSkk74dB4tPJI9J8FDFMu270h7yaut get transaction error"
	// 交易不存在，很可能是服务器不稳定
	"msg": "payId c978p9tHLVsjseXBQMSUJ0wJAj0s5sfb does not exist"
	// 请求过于频繁
    "msg": "you are queried more than 20 times per minute, please wait"
}
 */

export function checkTx(sn) {
	if (!isValidPayId(sn)) return Promise.reject(new Error(error.INVALID_ARG))

	return new Promise((resolve, reject) => {
		// 在一分钟之内总共尝试 6 次，时间间隔做了优化，争取以最快的速度拿到交易结果
		const retryIntervals = [10, 5, 7, 8, 15, 15]
		let checkingCount = 0
		let lastCheckResult

		// 这里不应该立刻查询，因为此时服务器可能还没有收到交易记录
		const interval = retryIntervals.shift()
		setTimeout(check, interval * 1000)

		function check() {
			nebPay.queryPayInfo(sn, config.getNebPayOptions())
				.then((res) => {
					checkingCount++
					console.log(`checkTx result ${checkingCount}: `, typeof res, res)

					let data = {}
					try {
						data = JSON.parse(res)
					} catch (e) {
						console.error('JSON parsing error')
					}
					lastCheckResult = data
					if (data.code === 0) {
						// 本次查询成功
						const txData = data.data
						// 0: Failed. It means the transaction has been submitted on chain but its execution failed.
						// 1: Successful. It means the transaction has been submitted on chain and its execution succeed.
						// 2: Pending. It means the transaction hasn't been packed into a block.
						if (txData.status === 0) {
							const errMsg = data.type === 'call' ? error.CALL_FAILED : error.TX_FAILED
							reject(new Error(errMsg))
						} else if (txData.status === 1) {
							console.log('get tx info: ', txData)
							// 处理合约返回值
							let result = txData.execute_result
							try {
								result = JSON.parse(result)
							} catch (e) {
								result = null
							}
							txData.result = result
							resolve(txData)
						} else if (txData.status === 2) {
							retry()
						} else {
							reject(new Error(error.TX_STATUS_UNKNOWN))
						}
					} else {
						// 如果返回错误信息，很可能只是服务器不稳定，所以不放弃，继续重试
						const msg = data.msg || ''
						console.error(msg)
						retry()
					}
				}, (err) => {
					// 网络错误会进到这里。不放弃，继续重试
					console.error(err.message || error.NETWORK_ERROR)
					retry()
				})
		}

		function retry() {
			const interval = retryIntervals.shift()
			if (!interval) {
				// 所有重试机会已用完
				reject(new Error(error.REQUEST_TIMEOUT))

				// TODO 考虑是不是把 "payId 不存在" 也作为一种错误
				// 通过 lastCheckResult 来获取查询错误信息
				// TODO 考虑是不是把 "网络错误" 也作为一种错误
			} else {
				setTimeout(check, interval * 1000)
			}
		}
	})
}
