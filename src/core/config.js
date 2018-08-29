import * as env from '../env/index'
import { each } from '../_helper/index'
import { NEBULAS_CONFIG } from './_nebulas-config'

export function config(config) {
	const envList = [env.LOCAL, env.TEST, env.MAIN]
	const keyWhiteList = ['endpoint']
	each(config, function (value, key) {
		if (envList.includes(key) && typeof value === 'object') {
			// pick white list key
			const envConfig = {}
			keyWhiteList.forEach(function (item) {
				if (value[item]) envConfig[item] = value[item]
			})

			Object.assign(NEBULAS_CONFIG[key], envConfig)
		}
	})

}
