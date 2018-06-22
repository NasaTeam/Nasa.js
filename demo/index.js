/* global Nasa */
'use strict'

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
