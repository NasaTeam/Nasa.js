/* global Nasa */
'use strict'

const ERROR_ARGS = `Error: Syntax error in args field!

* 多个参数之间请用逗号分隔
* 如果不需要传入参数，则留空即可`

const ERROR_CONTRACT_CONFIG = `Error: Syntax error in your input!

* 请填写一个对象字面量
* 不需要严格遵守 JSON 规范`

////////////////////  core  ////////////////////
$('#core--call').on('click', function () {
	// check env
	if (
		!Nasa.ua.isMobileDevice() &&
		!(Nasa.ua.isDesktopChrome() && Nasa.ua.isWalletExtensionInstalled())
	) {
		alert('抱歉，暂不支持您当前的浏览器环境！')
		return
	} else if (Nasa.ua.isWeChat()) {
		alert('抱歉，微信浏览器不支持唤起手机钱包 App。\n\n请点右上角菜单，再选择 “在浏览器打开”。')
		return
	}

	const $this = $(this)
	const contract = $this.siblings('input[name="contract"]').val().trim()
	const fn = $this.siblings('input[name="fn"]').val().trim()
	const inputArgs = $this.siblings('input[name="args"]').val().trim()
	const $extra = $this.siblings('.extra')
	const $inputPayId = $extra.find('input[name="payId"]')

	const text = $this.text()
	const DISABLED = 'disabled'
	const restoreBtn = () => {$this.text(text).removeAttr(DISABLED)}
	$this.text('Calling contract...')
		.attr(DISABLED, DISABLED)

	// form args
	let args = []
	if (inputArgs) {
		try {
			const input = `args = [${inputArgs}]`
			eval(input)
		} catch (e) {
			restoreBtn()
			alert(ERROR_ARGS)
			return
		}
	}

	Nasa.call(contract, fn, args)
		.then((payId) => {
			restoreBtn()
			$inputPayId.val(payId)
			setTimeout(() => {
				$extra.show()
			}, 5000)
		})
		.catch((e) => {
			restoreBtn()
			let msg = e.message
			if (msg === Nasa.error.TX_REJECTED_BY_USER) {
				msg = '您已取消交易！'
			}
			alert(msg)
		})
})



$('#core--query').on('click', function () {
	const $this = $(this)
	const contract = $this.siblings('input[name="contract"]').val().trim()
	const fn = $this.siblings('input[name="fn"]').val().trim()
	const inputArgs = $this.siblings('input[name="args"]').val().trim()

	const text = $this.text()
	const DISABLED = 'disabled'
	const restoreBtn = () => {$this.text(text).removeAttr(DISABLED)}
	$this.text('Querying contract...')
		.attr(DISABLED, DISABLED)

	// form args
	let args = []
	if (inputArgs) {
		try {
			const input = `args = [${inputArgs}]`
			eval(input)
		} catch (e) {
			restoreBtn()
			alert(ERROR_ARGS)
			return
		}
	}

	Nasa.query(contract, fn, args)
		.then((data) => {
			restoreBtn()
			alert(JSON.stringify(data, null, 4))
		})
		.catch((e) => {
			restoreBtn()
			alert(e.message)
		})
})

$('#core--checkTx').on('click', function () {
	const $this = $(this)
	const $input = $this.siblings('input[type="text"]')
	const value = $input.val().trim()

	const text = $this.text()
	const DISABLED = 'disabled'
	const restoreBtn = () => {$this.text(text).removeAttr(DISABLED)}
	$this.text('Checking Tx...')
		.attr(DISABLED, DISABLED)

	Nasa.checkTx(value, {noWait: true})
		.then((data) => {
			restoreBtn()
			alert(JSON.stringify(data, null, 4))
		})
		.catch((e) => {
			restoreBtn()
			alert(e.message)
		})
})

////////////////////  contract  ////////////////////
// prepare textarea
const $textarea = $('#contract--set').siblings('textarea')
$textarea.html($textarea.html().trim())

$('#contract--set').on('click', function () {
	const $textarea = $(this).siblings('textarea')
	const value = $textarea.val().trim()
	let config
	try {
		const input = `config = ${value}`
		eval(input)
	} catch (e) {
		alert(ERROR_CONTRACT_CONFIG)
		return
	}

	if (typeof config !== 'undefined') {
		Nasa.contract.set(config)
		alert(`Did set contracts.`)
	}
})
$('#contract--get').on('click', function () {
	const $input = $(this).siblings('input[type="text"]')
	const value = $input.val().trim()
	const addr = Nasa.contract.get(value) || '(not found)'
	const msg = [
		`Contract name: '${value || '(default)'}'`,
		`Current env:   '${Nasa.env.get()}'`,
		`Contract addr: '${addr}'`,
	].join('\n')
	alert(msg)
})


////////////////////  env  ////////////////////
$('#env--set').on('click', function () {
	const $select = $(this).siblings('select')
	const value = $select.val().trim()
	if (value) {
		Nasa.env.set(value)
		alert(`Did set '${value}' as current env.`)
	} else {
		alert('Error: Please select an env name first!')
	}
})
$('#env--get').on('click', function () {
	alert(`Current env: '${Nasa.env.get()}'.`)
})


////////////////////  user  ////////////////////
$('#user--getAddr').on('click', function () {
	Nasa.user.getAddr()
		.then((addr) => {
			alert(addr)
		})
		.catch((e) => {
			alert('Error: ' + e)
		})
})

////////////////////  ua  ////////////////////
$('#ua--isSupported').on('click', function () {
	alert(Nasa.ua.isSupported())
})
$('#ua--isMobileDevice').on('click', function () {
	alert(Nasa.ua.isMobileDevice())
})
$('#ua--isDesktopDevice').on('click', function () {
	alert(Nasa.ua.isDesktopDevice())
})
$('#ua--isDesktopChrome').on('click', function () {
	alert(Nasa.ua.isDesktopChrome())
})
$('#ua--isWeChat').on('click', function () {
	alert(Nasa.ua.isWeChat())
})
$('#ua--isWalletExtensionInstalled').on('click', function () {
	alert(Nasa.ua.isWalletExtensionInstalled())
})

////////////////////  ua  ////////////////////
$('#util--isValidAddr').on('click', function () {
	const $input = $(this).siblings('input[type="text"]')
	const value = $input.val().trim()
	alert(Nasa.util.isValidAddr(value))
})
$('#util--isValidTxHash').on('click', function () {
	const $input = $(this).siblings('input[type="text"]')
	const value = $input.val().trim()
	alert(Nasa.util.isValidTxHash(value))
})
$('#util--isValidPayId').on('click', function () {
	const $input = $(this).siblings('input[type="text"]')
	const value = $input.val().trim()
	alert(Nasa.util.isValidPayId(value))
})
