const mix = require('laravel-mix')

// 获取 BrowserSync 要代理的页面
const envConfig = require('dotenv').config()
envConfig.parsed = envConfig.parsed || {}
const MIX_PROXY = envConfig.parsed.MIX_PROXY || ''

mix.disableNotifications()
mix.options({
	uglify: {
		uglifyOptions: {
			ie8: true,
		},
	},
	autoprefixer: {
		options: {
			browsers: [
				'Android >= 5',
				'iOS >= 10',
				'Chrome >= 35',
				'Firefox >= 56',
				'Safari >= 11',
				'Explorer >= 11',
			],
		},
	},
	processCssUrls: false,
})

if (MIX_PROXY) {
	mix.browserSync({
		proxy: MIX_PROXY,
		port: 3098,
		ui: false,
		ghostMode: false,
		logLevel: 'debug',
		files: [
			'./demo/*.html',
			'./demo/*.css',
			'./demo/*.js',
			'./dist/**/*.js',
			'./.tmp/nasa*.js',
		],
		// notify: false,
		browser: [],
	})
}

// tasks - js
mix.js('./src/index.js', './.tmp/nasa-raw.js')

// task - demo - js
mix.combine([
	'./node_modules/underscore/underscore.js',
	'./node_modules/zepto.js/dist/zepto.js',
	'./node_modules/cmui-gearbox/dist/gearbox.js',
	'./node_modules/cmui/dist/cmui.js',
], './demo/lib.js')

// task - demo - css
mix.stylus('./demo/src/index.styl', './demo/')

