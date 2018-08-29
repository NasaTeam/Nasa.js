import * as error from '../const/error'
import * as _addr from '../util/_addr'
import { getNebulasConfig } from '../core/_nebulas-config'
import { get as getContract } from '../contract/index'
import {
	isValidAddr,
	stripErrorMsgPrefix,
} from '../util/index'

/*
从接口拿到的结果是一个 JSON 对象。
当查询成功时： {result: {
	estimate_gas: "20490",
	execute_err: "",
	result: "...json string...",
}}
如果合约不存在： {result: {
	estimate_gas: "20153",
	execute_err: "contract check failed",
	result: "",
}}
如果钱包无余额： {result: {
	estimate_gas: "20490",
	execute_err: "insufficient balance",
	result: "...json string...",
}}

合约执行时抛错： {result: {
	result: "TypeError: Cannot read property 'trim' of undefined",
	// 运行时错误
	execute_err: "Call: TypeError: Cannot read property 'trim' of undefined",
	// 合约主动抛错
	execute_err: "Call: Error: value has been occupied",
	estimate_gas: "20138",
}}

当请求所用的地址非法，或请求的合约地址非法（400 error）： {
	error: 'address: invalid address type',
} 或 {
	error: 'address: invalid address checksum',
} 或 {
	error: 'address: invalid address format',
}

当服务器过载（503 Service Unavailable），返回字符串：
'{"err:","Sorry, we received too many simultaneous requests.
Please try again later."}'

查询失败时，result 为空字符串，execute_err 的值如下：
	合约不存在（通常是主网和测试网搞混了）： "contract check failed"
	合约语法错误（通常是节点不稳定）： "contract syntax error"
	合约执行超时（通常是节点不稳定）： "Error: execution timeout"
*/

export function query(contract, fnName, args = [], options = {}) {
	// get contract
	const contractAddr = isValidAddr(contract) ?
		contract : getContract(contract)
	if (!contractAddr || !fnName || !Array.isArray(args)) {
		return Promise.reject(new Error(error.INVALID_ARG))
	}

	const fromAddr = options.from || _addr.getAvailableAddr()
	if (!isValidAddr(fromAddr)) {
		return Promise.reject(new Error(error.INVALID_ADDR))
	}

	const api = getNebulasConfig('endpoint') + 'v1/user/call'
	const txParams = {
		from: fromAddr,
		to: contractAddr,
		value: '0',
		nonce: '0',
		gasPrice: '1000000',
		gasLimit: '2000000',
		type: 'call',
		contract: {
			'function': String(fnName),
			args: JSON.stringify(args),
		}
	}
	return fetch(api, {
		body: JSON.stringify(txParams),
		headers: {'content-type': 'application/json'},
		method: 'POST',
		cache: 'no-cache',
		mode: 'cors',
	})
		.then((res) => {
			if (res.ok) {
				return res.json()
			} else {
				// TODO 400 响应会进这里，因此错误似乎应该是 RESPONSE_ERROR 或 REQUEST_ERROR
				throw new Error(error.INVALID_RESPONSE)
			}
		}, () => {
			// TODO 503 响应会进这里，因此错误似乎应该是 SERVER_ERROR
			throw new Error(error.NETWORK_ERROR)
		})
		.then((res) => {
			const data = res.result || {}
			const output = {
				estimateGas: data.estimate_gas,
			}
			// 1. 看服务端有没有返回错误信息
			const errMsg = data.execute_err
			// 'insufficient balance' 这个错误是正常的，内置的默认地址本来就没钱
			if (errMsg && errMsg !== 'insufficient balance') {
				output.execError = stripErrorMsgPrefix(errMsg)
			}

			// 2. 试图解析服务端返回的数据
			else {
				let result = data.result
				try {
					result = JSON.parse(data.result)
				} catch (e) {/* do nothing */}
				output.execResult = result
			}
			return output
		})
}
