import {
	supportFetch,
	supportStringProtoIncludes,
	supportArrayProtoIncludes,
	supportObjectAssign,
} from './_detect-feature'

function isSupported() {
	return supportFetch()
		&& supportStringProtoIncludes()
		&& supportArrayProtoIncludes()
		&& supportObjectAssign()
}

function isWalletExtensionInstalled() {
	// See: https://github.com/NasaTeam/Nasa.js/issues/17
	// new implement
	if (typeof NasExtWallet === 'object') {
		return true
	}

	// ========== v0.3 删除以下代码 ==========
	// old implement
	const beacon = window.webExtensionWallet
	return !!beacon && String(beacon).includes('nebulas')
}

// ========== v0.3 删除以下代码 ==========
// simulate NasExtWallet, for low version NasExtWallet + high version nebPay
if (isWalletExtensionInstalled() && !window.NasExtWallet) {
	window.NasExtWallet = {}
}

// TODO
// function isWalletMobileAppInstalled() {}

export {
	isSupported,
	isWalletExtensionInstalled,
	// isWalletMobileAppInstalled,
}
export {
	isMobileDevice,
	isDesktopDevice,
	isDesktopChrome,
	isWeChat,
	isWalletMobileApp,
} from './_detect-ua'
