import { nebPay, BigNumber, blockies } from './external-dependency'
import { error } from './const/index'
import * as ua from './ua/index'
import * as util from './util/index'
import * as user from './user/index'
import * as env from './env/index'

// ns
const Nasa = {
	// deps
	nebPay,
	BigNumber,
	blockies,

	// const
	error,

	// modules
	ua,
	util,
	user,
	env,


}




// exports
window.Nasa = Nasa
