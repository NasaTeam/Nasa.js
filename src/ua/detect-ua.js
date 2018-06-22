import { ua, _detect } from './gearbox-ua'

let isDetected = false
let result

function doDetect() {
	result = _detect(ua)
}

function isMobileDevice() {
	if (!isDetected) doDetect()
	return result.isMobileDevice
}
function isDesktopDevice() {
	if (!isDetected) doDetect()
	return !result.isMobileDevice

}
function isDesktopChrome() {
	if (!isDetected) doDetect()
	return result.isChrome && isDesktopDevice()
}

function isWeChat() {
	if (!isDetected) doDetect()
	return result.browser === 'wechat'
}

export {
	isMobileDevice,
	isDesktopDevice,
	isDesktopChrome,
	isWeChat,
}
