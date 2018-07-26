import * as config from './config'
import { get as getContract } from '../contract/index'
import { isValidAddr } from '../util/index'
import * as error from '../const/error'
import * as _addr from '../util/addr'

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
合约代码语法错误（通常是节点不稳定）： {result: {
	result: '',
	execute_err: 'contract code syntax error',
	estimate_gas: 20101,
}}

当请求所用的地址非法，或请求的合约地址非法（400 error）： {
	error: 'address: invalid address type',
} 或 {
	error: 'address: invalid address checksum',
} 或 {
	error: 'address: invalid address format',
}
当请求被节点限流（503 error），返回字符串：
'{"err:","Sorry, we received too many simultaneous requests.
Please try again later."}'

当服务器故障： 503 Service Unavailable

*/

export function query(contractAddr, fnName, args = []) {
	// get contract
	const contract = isValidAddr(contractAddr) ?
		contractAddr : getContract(contractAddr)
	if (!contract || !fnName || !Array.isArray(args)) {
		return Promise.reject(new Error(error.INVALID_ARG))
	}

	const randomAddr = _addr.getAvailableAddr()
	// console.log(randomAddr)

	const api = config.get('apiBaseUrl') + 'user/call'
	const txParams = {
		from: randomAddr,
		to: contract,
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
				// 合法的合约地址也加入备用地址的池子
				_addr.addAvailableAddr(contractAddr)

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
			// 1. 看服务端有没有返回错误信息
			const exeErr = data.execute_err
			// 'insufficient balance' 这个错误是正常的，本来这个内置的默认地址就没钱
			if (exeErr && exeErr !== 'insufficient balance') {
				throw new Error(exeErr)
			}

			// 2. 试图解析服务端返回的数据
			let result = null
			try {
				result = JSON.parse(data.result)
			} catch (e) {
				throw new Error(error.INVALID_JSON)
			}
			return result
		})
}
