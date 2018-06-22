import { nebPay, BigNumber, blockies } from './external-dependency'
import { env, error } from './const/index'
import * as ua from './ua/index'
import * as util from './util/index'
import * as user from './user/index'

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
	user,

}




// exports
window.Nasa = Nasa
