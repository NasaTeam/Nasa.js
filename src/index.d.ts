import BigNumber from 'bignumber.js'

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
	estimateGas: string
	execError: string
	execResult: any
}

interface QueryOptions {
	from?: string
}

type Query = (contract: string, fnName: string, args?: any[], options?: QueryOptions) => Promise<QueryResult>

// contract

interface ContractSetConfig {
	[key: string]: {
		local?: string
		testnet?: string
		mainnet?: string
	}
}

interface Contract {
	set(config: ContractSetConfig): void

	get(contractName?: string): string

	query: Query
}

// tx - call

interface CallResult {
	txHash: string
	payId: string
}

interface CallOptions {
	value?: string
}

type Call = (contract: string, fnName: string, args?: any[], options?: CallOptions) => Promise<CallResult>

// tx - getTxResult

interface TxResult {
	type: 'call' | 'binary'
	nonce: number
	gasPrice: string
	gasLimit: string
	gasUsed: string
	chainId: string
	from: string
	to: string
	value: string
	hash: string
	status: 0 | 1 | 2
	timestamp: number
	execResult: any
	execError: string
}

interface GetTxResultOptions {
	noWait?: boolean
}

type GetTxResult = (sn: string, options?: GetTxResultOptions) => Promise<TxResult>

// tx

interface Tx {
	checkTx: GetTxResult
	call: Call
}

// ua

interface Ua {
	isSupported(): boolean

	isWalletExtensionInstalled(): boolean

	isMobileDevice(): boolean

	isDesktopDevice(): boolean

	isDesktopChrome(): boolean

	isWeChat(): boolean

	isWalletMobileApp(): boolean

	isNasNano(): boolean
}

// util

interface Util {
	isValidAddr(str: string): boolean

	isValidTxHash(str: string): boolean

	isValidPayId(str: string): boolean

	ready(fn: (...args: any[]) => any): void
}

// user

interface User {
	getAddr(): Promise<string>
}

// env

interface EnvNames {
	MAIN: string
	TEST: string
	LOCAL: string
	MAINNET: string
	TESTNET: string
}

interface Env extends EnvNames {
	set(envName: keyof EnvNames): void

	get(): keyof EnvNames
}

interface NasaInstance {
	VERSION: string

	BigNumber: BigNumber
	nebPay: any

	config: Config
	query: Query
	call: Call
	getTxResult: GetTxResult
	checkTx: GetTxResult	// deprecated
	ready: Util['ready']

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
