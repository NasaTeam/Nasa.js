// error constants

interface ErrorConstants {
	INVALID_ARG: string
	INVALID_USER_ADDR: string
	INVALID_CONTRACT_ADDR: string

	NETWORK_ERROR: string
	SERVER_ERROR: string
	INVALID_REQUEST: string
	INVALID_CONTRACT: string
	TX_TIMEOUT: string
	PAY_ID_REG_FAILED: string

	TX_REJECTED_BY_USER: string
	TX_STATUS_UNKNOWN: string
	TX_FAILED: string
	CALL_FAILED: string
	DEPLOY_FAILED: string

	EXTENSION_NOT_INSTALLED: string
	EXTENSION_TIMEOUT: string
	EXTENSION_NO_WALLET: string
}

// core - config

type Config = <T extends object>(config: T) => void

// core

interface Core {
	config: Config
}

// contract - query

interface QueryResult {
	result: {
		estimate_gas: string
		execute_err: string
		result: string
	}
	error: string
}

type Query = <R extends QueryResult>(contract: string, fnName: string, args?: any[], options?: object) => Promise<R>

// contract

interface Contract {
	set<T extends object>(config: T): void

	get(contractName?: string): string

	query: Query
}

// tx - call

interface CallResult {
	txhash: string
	contract_address: string
	error: string
}

type Call = <R extends CallResult>(contract: string, fnName: string, args?: any[], options?: object) => Promise<R>

// tx - checkTx

interface CheckTxResult<T extends object = {}> {
	code: number
	data: T
	msg: string
}

type CheckTx = <R extends CheckTxResult, T extends object>(sn: string, options?: T) => Promise<CheckTxResult>

// tx

interface Tx {
	checkTx: CheckTx
	call: Call
}

// ua

interface Ua {
	isSupported(): boolean

	isWalletExtensionInstalled(): boolean

	isMobileDevice(): boolean

	isDesktopDevice(): boolean

	isDesktopChrome(): boolean

	isWeChatisWalletMobileApp(): boolean
}

// util

interface Util {
	isValidAddr(str: string): boolean

	isValidTxHash(str: string): boolean

	isValidPayId(str: string): boolean

	stripErrorMsgPrefix(str: string): string
}

// user

interface User {
	getAddr(): Promise<string>
}

// env

type EnvName = 'mainnet' | 'testnet' | 'local'

interface Env {
	set(envName: EnvName): void

	get(): EnvName

	MAIN: string
	TEST: string
	LOCAL: string
	MAINNET: string
	TESTNET: string
}

interface NasaInstance {
	VERSION: string
	config: Config
	query: Query
	call: Call
	checkTx: CheckTx

	error: ErrorConstants
	core: Core
	contract: Contract
	tx: Tx
	ua: Ua
	util: Util
	user: User
	env: Env
}

declare const Nasa: NasaInstance

export default Nasa
