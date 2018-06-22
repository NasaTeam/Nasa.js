import {
	supportFetch,
	supportStringIncludes,
} from './detect-feature'

export {
	isMobileDevice,
	isDesktopDevice,
	isDesktopChrome,
	isWeChat,
} from './detect-ua'


function isSupported() {
	return supportFetch() &&
		supportStringIncludes()
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
