/* global nebPay */
import * as config from '../core/index'
import * as error from '../const/error'
import * as ua from '../ua/index'
import { get as getContract } from '../contract/index'
import {
	isValidAddr,
	stripErrorMsgPrefix,
} from '../util'

export let _lastPayId = ''
export let _lastTxHash = ''

/*
listener 拿到的响应（res）：

如果钱包扩展没有导入钱包，这里的 res 是字符串 "error: please import wallet file"

某次电脑崩溃重启后，Chrome 在启动时弹出一个 alert 框：'please import wallet file'。
在首次发出查询型调用时，遇到这个错误：res 是这个字符串 'error: please import wallet file'。

某次新打开网页，遇到 res 是这个字符串 'stream terminated by RST_STREAM with error code: REFUSED_STREAM'，不过刷新一下就好了。

如果用户取消交易，这里的 res 是字符串 'Error: Transaction rejected by user'

如果用户已发出交易，这里的 res 是一个对象，结构是： {
	txhash: "5b7a9db52a519da277f4ba6799a2ebce18becbbed0c54950cb60b181facf4cfb",  //64 位 hash
	contract_address: ""	// 如果本次交易不是在部署合约，这个字段就是空字符串
}
如果钱包扩展发送流水号失败，则得到： {
	"txhash": "ae41d5459fc8db5ffaee5416585e0874d2324d258258b8c59cda789a04934e1a",
	"contract_address": "",
	"error": "{\"timestamp\":1531231627789,\"status\":400,\"error\":\"Bad Request\",\"exception\":\"org.springframework.web.bind.MissingServletRequestParameterException\",\"message\":\"Required String parameter 'payId' is not present\",\"path\":\"/api/pay\"}"
}
*/

export function call(contractAddr, fnName, args = [], options = {}) {
	// get contract
	const contract = isValidAddr(contractAddr) ?
		contractAddr : getContract(contractAddr)

	if (!contract || !fnName || !Array.isArray(args)) {
		return Promise.reject(new Error(error.INVALID_ARG))
	}

	return new Promise((resolve, reject) => {
		const to = contract
		const value = options.value || '0'
		let nebPayOptions = {
			qrcode: { showQRCode: false },
			listener: (payId, res) => {
				/** DEBUG_INFO_START **/
				console.log('listener: ', typeof res, res)
				/** DEBUG_INFO_END **/

				if (typeof res === 'string') {
					res = res.toLowerCase()
					// 如果用户取消交易
					if (res.includes('rejected by user')) {
						reject(new Error(error.TX_REJECTED_BY_USER))
					}
					// 如果服务器不稳定 (?)
					if (res.includes('stream terminated') || res.includes('REFUSED_STREAM')) {
						reject(new Error(error.SERVER_ERROR))
					}
					// 如果钱包扩展没有导入钱包
					if (res.includes('import wallet')) {
						reject(new Error(error.EXTENSION_NO_WALLET))
					}
					// 发生其它问题
					const errMsg = stripErrorMsgPrefix(res)
					reject(new Error(errMsg))
				}

				// 如果钱包扩展发送流水号失败
				// ref: https://github.com/NasaTeam/Nasa.js/issues/17
				else if (res.error) {
					reject(new Error(error.PAY_ID_REG_FAILED))
				}
				// 如果用户已发出交易
				else if (res.txhash) {
					_lastTxHash = res.txhash
					resolve({
						payId,
						txHash: res.txhash,
					})
				}
			},
		}
		nebPayOptions = Object.assign({}, config.getNebPayOptions(), nebPayOptions)

		// 这里的 payId 是由 nebPay 生成的交易流水号，32 位 hash
		// 对于交易型调用，只能通过这个流水号来查询交易结果
		let payId = nebPay.call(to, value, String(fnName), JSON.stringify(args), nebPayOptions)
		// console.log('payId: ', payId)
		_lastPayId = payId

		// 对于没有安装钱包扩展的浏览器来说，listener 没有作用，只能把 payId 抛出来。
		if (!ua.isWalletExtensionInstalled()) resolve({ payId })
	})
}
