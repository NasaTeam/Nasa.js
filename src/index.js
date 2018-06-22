import { nebPay, BigNumber, blockies } from './external-dependency'
import { env, error } from './const/index'
import * as ua from './ua/index'
import * as util from './util/index'

// ns
const Nasa = {
	// deps
	nebPay,
	BigNumber,
	blockies,

	// const
	env,
	error,

	// modules
	ua,
	util,

}




// exports
window.Nasa = Nasa
