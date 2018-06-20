import { nebPay, BigNumber, blockies } from './external-dependency'
import { env, error } from './const/index'

// ns
const Nasa = {
	// deps
	nebPay,
	BigNumber,
	blockies,

	// const
	env,
	error,


}




// exports
window.Nasa = Nasa
