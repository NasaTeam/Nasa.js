import {
	supportFetch,
	supportStringIncludes,
	supportArrayIncludes,
	supportObjectAssign,
} from './detect-feature'

export {
	isMobileDevice,
	isDesktopDevice,
	isDesktopChrome,
	isWeChat,
	isWalletMobileApp,
} from './detect-ua'


function isSupported() {
	return supportFetch()
		&& supportStringIncludes()
		&& supportObjectAssign()
		// && supportArrayIncludes()
}

function isWalletExtensionInstalled() {
	const beacon = window.webExtensionWallet
	return !!beacon && String(beacon).includes('nebulas')
}

// TODO
// function isWalletMobileAppInstalled() {}

export {
	isSupported,
	isWalletExtensionInstalled,
	// isWalletMobileAppInstalled,
}
