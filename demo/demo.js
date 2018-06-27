/* global Nasa */
'use strict'

////////////////////  core  ////////////////////
$('#core--query').on('click', function () {
	const $this = $(this)
	const contract = $this.siblings('input[name="contract"]').val().trim()
	const fn = $this.siblings('input[name="fn"]').val().trim()
	const inputArgs = $this.siblings('input[name="args"]').val().trim()

	const text = $this.text()
	const DISABLED = 'disabled'
	$this.text('Querying...')
		.attr(DISABLED, DISABLED)

	// form args
	let args = []
	if (inputArgs) {
		try {
			const input = `args = [${inputArgs}]`
			eval(input)
		} catch (e) {
			alert('Error: Syntax error in args field!')
			return
		}
	}

	Nasa.query(contract, fn, args)
		.then((data) => {
			alert(JSON.stringify(data, null, 4))
			$this.text(text).removeAttr(DISABLED)
		})
		.catch((e) => {
			alert(e.message)
			$this.text(text).removeAttr(DISABLED)
		})
})

$('#core--checkTx').on('click', function () {
	const $this = $(this)
	const $input = $this.siblings('input[type="text"]')
	const value = $input.val().trim()

	const text = $this.text()
	const DISABLED = 'disabled'
	$this.text('Checking...')
		.attr(DISABLED, DISABLED)

	Nasa.checkTx(value)
		.then((data) => {
			alert(JSON.stringify(data, null, 4))
			$this.text(text).removeAttr(DISABLED)
		})
		.catch((e) => {
			alert(e.message)
			$this.text(text).removeAttr(DISABLED)
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
		alert('Error: Syntax error in your input!')
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
