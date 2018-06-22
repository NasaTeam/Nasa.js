import { nebPay, BigNumber, blockies } from './external-dependency'
import { env, error } from './const/index'
import * as ua from './ua/index'

// ns
const Nasa = {
	// deps
	nebPay,
	BigNumber,
	blockies,

	// const
	env,
	error,

	// ua
	ua,

}




// exports
window.Nasa = Nasa
