
// simulate gearbox env
const gearbox = window.gearbox || {}
gearbox.str = gearbox.str || {}
gearbox.str.includes = gearbox.str.includes || ((str, subStr) => String(str).includes(subStr))

/* --------------------------------------------- */
// https://github.com/CMUI/gearbox/blob/master/src/ua.js

// namespace
var ua = {}

// detect by feature
// we want it to work with chrome's touch device simulator,
// so we don't use `document.createTouch` to detect.
ua.isTouchDevice = ('ontouchstart' in window) && ('ontouchmove' in window) &&
		('ontouchend' in window)

// detect by ua string
ua.str = navigator.userAgent

function _detect(ua) {
	var s = ua.str.toLowerCase()
	var _includes = gearbox.str.includes

	ua.isSafari = /\bapple\b/i.test(navigator.vendor) && /\bsafari\b/i.test(s)
	ua.isChrome = _includes(s, 'chrome') ||
			_includes(s, 'crios')	// both desktop and mobile version

	// platform version and device
	ua.osVersion = ''
	ua.isIOS = /\(i(?:phone|pod|pad)\b/.test(s) || /\bios \d+\./.test(s)
	if (ua.isIOS) {
		ua.isIPad = /\(ipad\b/.test(s)
		ua.isIPod = /\(ipod\b/.test(s)
		ua.isIPhone = /\(iphone\b/.test(s)
		ua.osVersion = (/[\/; i]os[\/: _](\d+(?:[\._]\d+)?)[\._; ]/.exec(s) || [0, ''])[1]
			.replace('_', '.')
	} else {
		var _includeAndroid = _includes(s, 'android')
		var _includeAdr = /\badr\b/.test(s) && /\blinux;\s*u;/.test(s)
		var _isJUC = /juc\s*\(linux;\s*u;\s*\d+\.\d+/.test(s)
		ua.isAndroid = _includeAndroid || _includeAdr || _isJUC
		if (_includeAdr || _isJUC) {
			ua.osVersion = (
				/\badr[\/: ]?(\d+\.\d)\d*\b/.exec(s) ||
				/\blinux;\s*u;\s*(\d+\.\d)\d*\b/.exec(s) || [0, '']
			)[1]
		} else {
			ua.osVersion = (/\bandroid(?:_os)?[\/: ]?(\d+\.\d)\d*\b/.exec(s) || [0, ''])[1]
		}
	}
	// fix - Windows Phone might pretend to be iOS or Android
	if (_includes(s, 'windows phone')) {
		ua.isIOS = ua.isAndroid = false
		ua.osVersion = ''
	}
	if (ua.osVersion && !_includes(ua.osVersion, '.')) ua.osVersion += '.0'

	// summery
	ua.isMobileDevice = !!(ua.isIOS || ua.isAndroid)

	// get browser info
	var browser = ''
	if (_includes(s, 'micromessenger')) {
		browser = 'wechat'
	} else if (_includes(s, 'ucbrowser') || _includes(s, 'ucweb') || _includes(s, ' uc applewebkit')) {
		browser = 'uc'
	} else if (_includes(s, 'baiduhd') || _includes(s, 'baiduboxapp')) {
		browser = 'baidu-app'
	} else if (_includes(s, 'baidubrowser')) {
		browser = 'baidu-browser'
	} else if (_includes(s, 'mqqbrowser')) {
		browser = 'm-qq-browser'
	} else if (_includes(s, 'miuibrowser')) {
		browser = 'miui'
	} else if (_includes(s, '_weibo_') || _includes(s, ' weibo ')) {
		browser = 'weibo'
	} else if (_includes(s, 'firefox')) {
		browser = 'firefox'
	} else if (_includes(s, 'opera')) {
		browser = 'opera'
	} else if (_includes(s, ' edge/')) {
		browser = 'edge'
	} else if (_includes(s, 'iemobile')) {
		browser = 'ie-mobile'
	}
	// these two must be the last
	else if (ua.isChrome) {
		browser = 'chrome'
		if (ua.isAndroid && /\bwv\b/.test(s)) browser = 'chrome-webview'
	} else if (ua.isSafari) {
		browser = 'safari'
	}

	// fix - some browsers might be detected as Chrome or Safari
	if (browser !== 'chrome') ua.isChrome = false
	if (browser !== 'safari') ua.isSafari = false

	// get engine info
	var engine = ''
	var engineVersion = ''
	var testChrome = /chrome[^\d]*([\.\d]*)[ ;\/]/.exec(s)
	if (testChrome) {
		engine = 'chrome'
		engineVersion = _trimVersion(testChrome[1])
	} else {
		var testWebKit = /webkit[^\d]*([\.\d]*)\+*[ ;\/]/.exec(s)
		if (testWebKit) {
			engine = 'webkit'
			engineVersion = _trimVersion(testWebKit[1])
		}
	}
	if (!engine) {
		if (_includes(s, 'webkit')) {
			engine = 'webkit'
		} else if (ua.isIOS) {
			engine = 'webkit'
		} else if (ua.isAndroid && browser === 'm-qq-browser') {
			engine = 'webkit'
		}
		if (browser === 'firefox' && !ua.isIOS) engine = 'gecko'
		if (browser === 'opera' && !ua.isIOS && _includes(s, 'presto')) engine = 'presto'
	}
	// fix Windows Phone, IE Mobile and Edge
	if (browser === 'edge') {
		engine = 'edge'
		engineVersion = ''
	} else if (browser === 'ie-mobile') {
		engine = engineVersion = ''
	}

	// output
	ua.browser = browser
	ua.engine = engine
	ua.engineVersion = engineVersion
	return ua
}

// util
// TODO: implement a stricter API: `gearbox.str.formatVersion(ver, length)`, e.g. ('1.2', 3) -> '1.2.0'
function _trimVersion(ver, length) {
	var temp = ver.split('.')
	temp.length = length || 2
	return _.compact(temp).join('.')
}

/* --------------------------------------------- */
export {
	ua,
	_detect,
}
