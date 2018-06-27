/* global NebPay, nebPay, BigNumber, ns */

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

// exports to an namespace
if (typeof ns !== 'undefined') {
	ns.Nasa = Nasa
}

// exports as a module
export default Nasa
