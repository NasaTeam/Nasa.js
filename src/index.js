import { NebPay, nebPay, BigNumber, blockies } from './external-dependency'
import { checkTx, query, call } from './core/index'
import { error } from './const/index'
import * as ua from './ua/index'
import * as util from './util/index'
import * as user from './user/index'
import * as env from './env/index'
import * as contract from './contract/index'

// ns
const Nasa = {
	// deps
	NebPay,
	nebPay,
	BigNumber,
	blockies,

	// const
	error,

	// core
	checkTx,
	query,
	call,

	// modules
	ua,
	util,
	user,
	env,
	contract,
}

// exports
window.Nasa = Nasa
