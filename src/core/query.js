import * as config from './config'
import { get as getContract } from '../contract/index'
import { isValidAddr } from '../util'
import * as error from '../const/error'

/*
从接口拿到的结果是一个 JSON 对象。
当查询成功时： {
	estimate_gas: "20490",
	execute_err: "",
	result: "...json string...",
}
如果合约不存在： {
	estimate_gas: "20153",
	execute_err: "contract check failed",
	result: "",
}
如果钱包无余额： {
	estimate_gas: "20490",
	execute_err: "insufficient balance",
	result: "...json string...",
}
*/

export function query(contractAddr, fnName, args = []) {
	// get contract
	const contract = isValidAddr(contractAddr) ?
		contractAddr : getContract(contractAddr)
	if (!contract) return Promise.reject(new Error(error.INVALID_ARG))

	if (!contract || !fnName || !Array.isArray(args)) {
		return Promise.reject(new Error(error.INVALID_ARG))
	}

	const api = config.get('apiBaseUrl') + 'user/call'
	const txParams = {
		from: config.DEFAULT_ADDR,
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
				return res.json()
			} else {
				throw new Error(error.INVALID_RESPONSE)
			}
		}, () => {
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
