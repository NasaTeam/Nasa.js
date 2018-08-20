/* global nebPay */
import * as config from '../core/index'
import * as error from '../const/error'
import * as ua from '../ua/index'
import * as _addr from '../util/addr'
import {
	isValidAddr,
	isValidPayId,
	stripErrorMsgPrefix,
} from '../util'

/*
当交易查询成功时，nebPay.queryPayInfo() 的返回值是一个 JSON 字符串，格式为： {
	"code": 0,
	"data": {},  // tx data
	"msg": "success",
}
当合约执行抛错时：{
	code : 0,
	data: {  // tx data
		...
		execute_error : "Call: Error: value has been occupied"
		execute_result : "Error: value has been occupied"
		status : 0
		...
	}
	msg : "success",
}
各种错误情况： {
	"code": 1,
	"data": {},
	// 交易查询失败（可能是服务器错误）
    "msg": "payId ZBTSkk74dB4tPJI9J8FDFMu270h7yaut get transaction error"
	// 交易不存在（通常是交易流水号向服务器注册失败）
	"msg": "payId c978p9tHLVsjseXBQMSUJ0wJAj0s5sfb does not exist"
	// 请求过于频繁
    "msg": "you are queried more than 20 times per minute, please wait"
}
 */

export function checkTx(sn, options = {}) {
	if (!isValidPayId(sn)) return Promise.reject(new Error(error.INVALID_ARG))

	return new Promise((resolve, reject) => {
		// 在一分钟之内总共尝试 6 次，时间间隔做了优化，争取以最快的速度拿到交易结果
		const retryIntervals = [10, 5, 7, 8, 15, 15]
		let checkingCount = 0
		let lastCheckResult

		if (options.noWait) {
			// 如果 API 的使用者显式要求立刻查询，那就立刻发起查询
			check()
		} else if (ua.isWalletExtensionInstalled()) {
			// 对于有钱包扩展的情况，在拿到流水号之后不应该立刻查询，因为此时服务器可能还没有收到交易记录
			const interval = retryIntervals.shift()
			setTimeout(check, interval * 1000)
		} else {
			// 其它情况下，立刻发起查询，因为可能钱包 App 已经支付完成了，不用等待
			check()
		}

		function check() {
			nebPay.queryPayInfo(sn, config.getNebPayOptions())
				.then((res) => {
					checkingCount++
					// console.log(`checkTx result ${checkingCount}: `, typeof res, res)

					let data = {}
					try {
						data = JSON.parse(res)
					} catch (e) {
						console.error('JSON parsing error')
					}
					lastCheckResult = data

					// 0: Failed. It means the transaction has been submitted on chain but its execution failed.
					// 1: Successful. It means the transaction has been submitted on chain and its execution succeed.
					// 2: Pending. It means the transaction hasn't been packed into a block.

					// 本次查询成功
					if (data.code === 0) {
						const txData = data.data || {}
						/** DEBUG_INFO_START **/
						console.log('get tx info: ', txData)
						/** DEBUG_INFO_END **/

						if (txData.status === 0) {
							// 先给个兜底的错误信息
							let errMsg = error.TX_FAILED
							if (txData.type === 'call') errMsg = error.CALL_FAILED
							// 再尝试获取精确的合约错误信息
							errMsg = stripErrorMsgPrefix(txData.execute_error)
							resolve(formatTxResult(txData, errMsg))
						} else if (txData.status === 1) {
							resolve(formatTxResult(txData))
						} else if (txData.status === 2) {
							retry()
						} else {
							reject(new Error(error.TX_STATUS_UNKNOWN))
						}

						// 把用户的钱包地址缓存下来
						const addr = txData.from
						if (isValidAddr(addr)) _addr.setAvailableAddr(addr)
					}
					// 本次查询出现错误
					else {
						// 如果返回错误信息，很可能只是服务器不稳定，所以不放弃，继续重试
						const msg = data.msg || error.SERVER_ERROR
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
			if (interval) {
				setTimeout(check, interval * 1000)
			} else {
				// 所有重试机会已用完
				reject(new Error(error.TX_TIMEOUT))

				// TODO 考虑是不是把持续的 "payId 不存在" 也作为一种错误
				// TODO 考虑是不是把持续的 "网络错误" 也作为一种错误
				// TODO 考虑是不是把持续的 "请求过于频繁" 也作为一种错误
				// 通过 lastCheckResult 来获取查询错误信息
			}
		}

	})
}

function formatTxResult(txData, errMsg) {
	// 处理拼写
	const output = {
		data:      txData.data,
		type:      txData.type,
		nonce:     txData.nonce,
		gasPrice:  txData.gas_price || txData.gasPrice,
		gasLimit:  txData.gas_limit || txData.gasLimit,
		gasUsed:   txData.gas_used || txData.gasUsed,
		chainId:   txData.chainId,
		from:      txData.from,
		to:        txData.to,
		value:     txData.value,
		hash:      txData.hash,
		status:    txData.status,
		timestamp: txData.timestamp,
	}
	// 处理合约返回值
	if (errMsg) {
		output.execError = errMsg
	} else {
		let result = txData.execute_result
		try {
			// `execute_result` 最长 255 字节，超长会被截断，极有可能解析失败
			// https://github.com/nebulasio/nebPay/issues/50
			result = JSON.parse(result)
		} catch (e) {/* do nothing */}
		output.execResult = result
	}
	return output
}
