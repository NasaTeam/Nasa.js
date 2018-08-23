/* global NebPay, nebPay, BigNumber, ns */
import * as core from './core/index'
import * as tx from './tx/index'
import { error } from './const/index'
import * as ua from './ua/index'
import * as util from './util/index'
import * as user from './user/index'
import * as env from './env/index'
import * as contract from './contract/index'
import { init } from './util/_init'

// ns
const Nasa = {
	// deps
	NebPay,
	nebPay,
	BigNumber,

	// const
	error,

	// modules
	core,
	tx,
	ua,
	util,
	user,
	env,
	contract,
}

// shortcut
Nasa.config = Nasa.core.config
Nasa.query = Nasa.contract.query
Nasa.call = Nasa.tx.call
Nasa.checkTx = Nasa.tx.checkTx

// alias
Nasa.ua.isNasNano = Nasa.ua.isWalletMobileApp

// init
init()

// version
Nasa.VERSION = '{{ version }}'

// exports to an namespace
if (typeof ns !== 'undefined') {
	ns.Nasa = Nasa
}

// exports as a module
export default Nasa
