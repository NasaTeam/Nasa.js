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

interface ExecResult {
	key: string
	value: string
	author: string
}

interface QueryResult {
	estimateGas: string
	execError: string
	execResult: ExecResult
}

interface QueryOptions {
	from?: string
}

type Query = (contract: string, fnName: string, args?: any[], options?: QueryOptions) => Promise<QueryResult>

// contract

interface Contract {
	set<T extends object>(config: T): void

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

// tx - checkTx

interface CheckTxResult {
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

interface CheckTxOptions {
	noWait?: boolean
}

type CheckTx = (sn: string, options?: CheckTxOptions) => Promise<CheckTxResult>

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
